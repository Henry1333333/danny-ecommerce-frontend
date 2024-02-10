import { Component } from '@angular/core';
import html2canvas from 'html2canvas';

import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { MenuItem, MessageService } from 'primeng/api';
import { CartItemModel } from 'src/app/model/cardmodel';
import { ProductoCarrito } from 'src/app/model/productcarrito';

import { IneiService } from 'src/app/service/inei.service';
import { ShoppingcartService } from 'src/app/service/shoppingcart.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Ventas } from 'src/app/model/ventas';
import { VentaService } from 'src/app/service/venta.service';
import { DetalleventaService } from 'src/app/service/detalleventa.service';
import { DetalleVenta } from 'src/app/model/detalleventa';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import { Recogertienda } from 'src/app/model/recogertienda';
import { TipoentregaService } from 'src/app/service/tipoentrega.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Envio } from 'src/app/model/envio';

@Component({
    selector: 'app-pago',
    templateUrl: './pago.component.html',
    styleUrls: ['./pago.component.scss'],
    providers: [MessageService],
})
export class PagoComponent {
    pagado: boolean = false;
    departamentos: any[] = [];
    provincias: any[] = [];
    distritos: any[] = [];
    private ticket: HTMLElement | null = null;
    selectedDepartamento: any;
    selectedProvincia: any;
    selectedDistrito: any;
    clienteNombre!: String;
    clienteApellido!: String;
    clienteDni!: String;
    clienteTelefono!: String;
    clienteCorreo!: String;
    clienteId!: number;
    productosEnCarrito: ProductoCarrito[] = [];
    public payPalConfig?: IPayPalConfig;
    precioTotal: string;
    precioTotal2: number;
    fechaActual: string;
    botonDesactivado: boolean = false;
    idventa: number;
    envioForm!: FormGroup;
    formularioEsValido: boolean = false;
    tipoEntrega: { value: string, label: string } | null = null;
    tipoDeEnvio: String;
    private subscription: Subscription = new Subscription();
    constructor(
        private ineiApiService: IneiService,
        private carritoService: ShoppingcartService,
        private ventaService: VentaService,
        private detalleventaService: DetalleventaService,
        private tipoEntregaService: TipoentregaService,
        ) {
        const fecha = new Date();
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();

        this.fechaActual = `${dia}/${mes}/${anio}`;
    }

    ngOnInit() {
        this.envioForm = this.buildForm();
        this.ineiApiService.getDepartamentos().subscribe((data) => {
            this.departamentos = this.mapDataToDropdownOptions(data);
        });
        this.ticket = document.getElementById('htmlData');

        let cliente = this.getCliente();
        if (cliente) {
            this.clienteId = cliente['id'];
            this.clienteNombre = cliente['nombre'];
            this.clienteApellido = cliente['apellido'];
            this.clienteDni = cliente['dni'];
            this.clienteTelefono = cliente['telefono'];
            this.clienteCorreo = cliente['email'];
        }

        this.getCarrito();

        this.payPalConfig = {
            currency: 'EUR',
            clientId: environment.clientId,
            createOrderOnClient: (data) =>
                <ICreateOrderRequest>{
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'EUR',
                                value: this.precioTotal,
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: this.precioTotal,
                                    },
                                },
                            },
                            items: this.getItemList(),
                        },
                    ],
                },
            advanced: {
                commit: 'true',
            },
            style: {
                label: 'paypal',
                layout: 'vertical',
            },
            onApprove: (data, actions) => {
                Swal.fire(
                    'Compra registrada!',
                    'Se ha registrado tu compra exitosamente!',
                    'success'
                );
                this.pagado = true;
                this.registrarVenta();
                setTimeout(() => {
                    this.registrarDetallesVenta();
                    this.envioForm.get('idventa')?.setValue(this.idventa);
                    if(this.tipoEntrega.value === 'Envio'){
                        this.envioForm.get('region')?.setValue(this.selectedDepartamento.value);
                        this.envioForm.get('provincia')?.setValue(this.selectedProvincia.value);
                        this.envioForm.get('distrito')?.setValue(this.selectedDistrito.value);
                        this.crearEnvio();
                    }else{
                        this.registrarRecogerTienda();
                    }
                    
                    
                }, 10000);
                console.log(
                    'onApprove - transaction was approved, but not authorized',
                    data,
                    actions
                );
                actions.order.get().then((details) => {
                    console.log(
                        'onApprove - you can get full order details inside onApprove: ',
                        details
                    );
                });
            },
            onClientAuthorization: (data) => {
                console.log(
                    'onClientAuthorization - you should probably inform your server about completed transaction at this point',
                    data
                );
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: (err) => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }

    buildForm(): FormGroup {
        return new FormGroup({
          idenvio: new FormControl(''),
          idventa: new FormControl(''),
          region: new FormControl('', Validators.required),
          provincia: new FormControl('', Validators.required),
          distrito: new FormControl('', Validators.required),
          direccionenvio: new FormControl('', Validators.required)
        })
      }
      crearEnvio(): void {
        if (this.envioForm.valid) {
          const formValues = this.envioForm.value;
          this.requestForCreate(formValues);
        } else {
          this.envioForm.markAllAsTouched();
        }
      } 
      
      requestForCreate(envio: Envio): void {
        this.tipoEntregaService.registerEnvio(envio)
          .subscribe(() => {
            console.log(envio)
          },
            (error) => {
              console.log(error)
            });
      }
    registrarVenta() {
        const datetime = new Date();
        const year = datetime.getFullYear();
        const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
        const day = ('0' + datetime.getDate()).slice(-2);
        const hours = ('0' + datetime.getHours()).slice(-2);
        const minutes = ('0' + datetime.getMinutes()).slice(-2);
        const seconds = ('0' + datetime.getSeconds()).slice(-2);
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        const dateObject: Date = new Date(formattedDate);
        const venta: Ventas = {
            idventa: null,
            idusuario: this.clienteId,
            tipoComprobate: 'Factura Electronica',
            tipoEntrega: this.tipoEntrega.value,
            fecha: dateObject,
            precioTotal: this.precioTotal2,
            estado: true,
        };

        this.ventaService.create(venta).subscribe(
            (response) => {
                const idVentaGenerado = response.idventa;
                this.idventa = response.idventa;
                console.log('Venta registrada con éxito:', idVentaGenerado);
                console.log('Venta registrada con éxito:', response);
            },
            (error) => {
                console.error('Error al registrar la venta:', error);
            }
        );
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    registrarDetallesVenta(): void {
        const detalleVenta: DetalleVenta[] = this.productosEnCarrito.map(
            (producto) => ({
                iddetventa: null,
                idventa: this.idventa,
                idproducto: producto.idproducto,
                cantidad: producto.cantidad,
                precio: producto.precio,
                estado: true,
            })
        );
        this.detalleventaService
            .registrarMultiplesDetallesVenta(detalleVenta)
            .subscribe(
                (response) => {
                    console.log(
                        'Detalles de venta registrados con éxito:',
                        response
                    );
                    // Puedes manejar la respuesta aquí según tus necesidades
                },
                (error) => {
                    console.error(
                        'Error al registrar detalles de venta:',
                        error
                    );
                    // Puedes manejar el error aquí según tus necesidades
                }
            );
    }

    tiposEntrega: any[] = [
        { label: 'Envío a domicilio', value: 'Envio' },
        { label: 'Recoger en tienda', value: 'Recoger en tienda' },
    ];

    registrarRecogerTienda(){
        const recoger: Recogertienda = {
            id: null,
            idventa: this.idventa,
            direccion: "Av. Las Palmeras 550",
        };

        this.tipoEntregaService.registerEntregaTienda(recoger).subscribe(
            (response) => {
                const idVentaGenerado = response.idventa;
                this.idventa = response.idventa;
                console.log('Venta registrada con éxito:', idVentaGenerado);
                console.log('Venta registrada con éxito:', response);
            },
            (error) => {
                console.error('Error al registrar la venta:', error);
            }
        );
    }  
    getCarrito(): void {
        this.productosEnCarrito =
            this.carritoService.obtenerProductosEnCarrito();
    }
    mostrarYDespuesOcultar() {
        if (this.ticket) {
            this.ticket.style.visibility = 'visible';
            setTimeout(() => {
                this.ocultarDiv();
            }, 10);
        }
    }
    onFormularioChange() {
        this.formularioEsValido = this.envioForm.valid;
      }
    ocultarDiv() {
        if (this.ticket) {
            this.ticket.style.visibility = 'hidden';
        }
    }
    getItemList(): any[] {
        const items: any[] = [];

        this.productosEnCarrito.forEach((it: any) => {
            // Cambiado "this.productosEnCarrito" a "it: any"
            const item = {
                name: it.nombre,
                quantity: it.cantidad,
                unit_amount: { value: it.precio, currency_code: 'EUR' },
            };

            items.push(item);
        });
        return items;
    }

    downloadPDF() {
        this.mostrarYDespuesOcultar();
        const DATA = document.getElementById('htmlData');
        const doc = new jsPDF('p', 'pt', 'a4');
        const options = {
            background: 'white',
            scale: 3,
        };

        html2canvas(DATA, options).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save(`${this.fechaActual}_comprobante_compra.pdf`);
        });
    }

    obtenerPrecioTotalCarrito(): number {
        var precio = this.carritoService.obtenerPrecioTotal();
        this.precioTotal = precio.toString();
        this.precioTotal2 = precio;
        return this.carritoService.obtenerPrecioTotal();
    }

    public getCliente() {
        let userStr = localStorage.getItem('user');
        if (userStr != null) {
            return JSON.parse(userStr);
        } else {
            return null;
        }
    }

    onDepartamentoChange() {
        if (this.selectedDepartamento) {
            this.ineiApiService
                .getProvinciasPorDepartamento(this.selectedDepartamento.value)
                .subscribe((data) => {
                    this.provincias = this.mapDataToDropdownOptions(data);
                    this.selectedProvincia = null; // Reinicia la selección de provincia
                    this.selectedDistrito = null; // Reinicia la selección de distrito
                });
        }
    }

    onProvinciaChange() {
        if (this.selectedProvincia) {
            this.ineiApiService
                .getDistritosPorProvincia(this.selectedProvincia.value)
                .subscribe((data) => {
                    this.distritos = this.mapDataToDropdownOptions(data);
                    this.selectedDistrito = null; // Reinicia la selección de distrito
                });
        }
    }

    private mapDataToDropdownOptions(data: string[]): any[] {
        return data.map((item) => ({ label: item, value: item }));
    }
}
