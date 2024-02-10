import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CloudinaryResponse } from 'src/app/model/cloudinary';
import { Producto } from 'src/app/model/producto';
import { ProductoList } from 'src/app/model/productolist';
import { CategoriaService } from 'src/app/service/categoria.service';
import { ImageService } from 'src/app/service/image.service';
import { ProductoService } from 'src/app/service/producto.service';
import { ShoppingcartService } from 'src/app/service/shoppingcart.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-producto',
  providers: [MessageService, ImageService],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent {
  productoForm!: FormGroup;
  producto: Producto[] = [];
  productoList: ProductoList[] = [];
  registerDialog: boolean = false;
  updateDialog: boolean = false;
  booleano: boolean = true; 
  selectedCategoria: any;
  categorias: any[];
  numberCategorias:number;
  selectedFile: File | null = null;
  imageUrl: String | null = null;
  constructor(private productoService: ProductoService, private messageService: MessageService,
     private categoriaService: CategoriaService, private imageService: ImageService){
  }
  
  ngOnInit(): void {
    this.productoForm = this.buildForm();
    this.getAll();
    this.getCategorias();
    this.productoForm.reset();

  }
  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0] as File;
    }
  }
  

  onUpload() {
    if (this.selectedFile || this.productoForm.valid) {
      this.imageService.uploadImage(this.selectedFile).subscribe(
        (response: CloudinaryResponse) => {
          console.log('Respuesta de carga de imagen:', response);
          this.imageUrl = response.url;
          const valor: number = this.selectedCategoria.value
          if(valor){
            this.productoForm.get('idcategoria')?.setValue(valor);
          }
          this.productoForm.get('imagen')?.setValue(this.imageUrl);
          const formValues = this.productoForm.value;
          this.requestForCreate(formValues);
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    }else{
      this.productoForm.markAllAsTouched();
    }
  }

  getAll(): void {
    this.productoService.get().subscribe((data) => {
      this.productoList = data;
    })
  }
  getCategorias(): void {
    this.categoriaService.get().subscribe((data) => {
      this.categorias = data.map((cat) => ({ label: cat.nombre, value: cat.idcategoria  })); 
    });
  }

  /*crear(): void {

    if (this.productoForm.valid) {
      const valor: number = this.selectedCategoria.value
      if(valor){
        this.productoForm.get('idcategoria')?.setValue(valor);
      }
      this.productoForm.get('imagen')?.setValue(this.imageUrl);
      const formValues = this.productoForm.value;
      this.requestForCreate(formValues);
    } else {
      this.productoForm.markAllAsTouched();
    }
  }*/
  actualizar(): void {
    if (this.productoForm.valid) {
      const valor: number = this.selectedCategoria.value
      if(valor){
        this.productoForm.get('idcategoria')?.setValue(valor);
        console.log(valor)
      }
      const formValues = this.productoForm.value;
      this.requestForUpdate(formValues);
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  requestForCreate(producto: Producto): void {
    this.productoService.create(producto)
      .subscribe(() => {
        Swal.fire(
          'Registro exitoso!',
          'Producto registrado exitosamente',
          'success'
        )
        this.getAll();
        this.productoForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al registrar producto!",
          });
          console.log(error)
        });
        this.registerDialog = false;
  }

  requestForUpdate(producto: Producto): void {
    this.productoService.update(producto)
      .subscribe(() => {
        Swal.fire(
          'Actualización exitosa!',
          'Se actualizó la información del producto!',
          'success'
        )
        this.getAll();
        this.productoForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al registrar producto!",
          });
          console.log(error)
        });
        this.updateDialog = false;
  }

  buildForm(): FormGroup {
    return new FormGroup({
      idproducto: new FormControl(''),
      idcategoria: new FormControl(this.numberCategorias, Validators.required),
      codigo: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      cantidad: new FormControl('', Validators.required),
      imagen: new FormControl(''),
      estado: new FormControl('')
    })
  }

  onDelete(id: any): void {
    var parseId = parseInt(id)
    Swal.fire({
      icon: 'info',
      title: 'Esta seguro de eliminar este producto?',
      showDenyButton: true,
      confirmButtonText: 'Si, eliminar',
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.delete(id).subscribe(() => {
          Swal.fire('Producto eliminado!', '', 'success')

          this.getAll();
        })
      } else if (result.isDenied) {
        Swal.fire('No se guardaron los cambios', '', 'info')
      }
    })
  }

  loadUser(id: any){
    var parseId = parseInt(id);
    let currentUser = this.productoList.find((p) =>{
      return p.idproducto=== id;
    });
    this.productoForm.patchValue({
      idproducto: currentUser?.idproducto, 
      codigo: currentUser?.codigo,
      nombre: currentUser?.nombre,
      descripcion:currentUser?.descripcion,
      precio: currentUser?.cantidad,
      imagen: currentUser?.imagen,
      cantidad: currentUser?.cantidad,
      estado: currentUser?.estado
    })
  }
  onCloseDialog() {
    this.productoForm.reset();
  }
  openRegister() {
    this.registerDialog = true;
  }
  openUpdate() {
    this.updateDialog = true;
  }
  onClose() {
    this.registerDialog = false;
    this.updateDialog = false;
    this.onCloseDialog();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  boolToString(value: boolean): string {
    return value ? 'Activo' : 'Desactivado';
  }
}
