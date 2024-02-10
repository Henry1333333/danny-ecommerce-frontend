import { Component } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ProductoCarrito } from 'src/app/model/productcarrito';
import { Producto } from 'src/app/model/producto';

import { ProductoList } from 'src/app/model/productolist';
import { ProductoService } from 'src/app/service/producto.service';
import { ShoppingcartService } from 'src/app/service/shoppingcart.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
    productoList: ProductoList[] = [];

    sortOrder: number = 0;
    sortOptions: SelectItem[] = [];
    sortField: string = '';
    productos: ProductoCarrito[] = [];
    constructor(
        private productoService: ProductoService,
        private carritoService: ShoppingcartService
    ) {}

    ngOnInit(): void {
        this.getAll();

        this.sortOptions = [
            { label: 'Precio alto a bajo', value: '!precio' },
            { label: 'Precio bajo a alto', value: 'precio' },
        ];
    }

    /*findById(id: any): void {
      this.productoService.find(id).subscribe((data) => {
        this.product = data;
        console.log("hola")
      })
    }*/

    getAll(): void {
        this.productoService.get().subscribe((data) => {
            this.productoList = data;
        });
    }

    agregarAlCarrito(producto: ProductoCarrito) {
        if(this.getCliente()){
            this.carritoService.agregarAlCarrito(producto);
        }else{
            Swal.fire({
                title: "Inicia Sesión",
                text: "Para mejorar tu experencia de usuario inicia sesión el cual te "+
                "permitirá ver tu compras, autocompletado de datos al realizar la compra de un producto, etc.",
                icon: "info"
              });
        }
        
    }
    public getCliente() {
        let userStr = localStorage.getItem('user');
        if (userStr != null) {
            return JSON.parse(userStr);
        } else {
            return null;
        }
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }
}
