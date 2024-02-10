import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Categoria } from 'src/app/model/categoria';
import { CategoriaService } from 'src/app/service/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  providers: [MessageService],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent {
  categoriaForm!: FormGroup;
  categoria: Categoria[] = [];
  registerDialog: boolean = false;
  updateDialog: boolean = false;
  booleano: boolean = true; 
  constructor(private categoriaService: CategoriaService, private messageService: MessageService){
  }

  ngOnInit(): void {
    this.categoriaForm = this.buildForm();
    this.getAll();
  }

  buildForm(): FormGroup {
    return new FormGroup({
      idcategoria: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      estado: new FormControl('')
    })
  }

  getAll(): void {
    this.categoriaService.get().subscribe((data) => {
      this.categoria = data;
    })
  }

  crear(): void {
    if (this.categoriaForm.valid) {
      const formValues = this.categoriaForm.value;
      this.requestForCreate(formValues);
    } else {
      this.categoriaForm.markAllAsTouched();
    }
  }
  actualizar(): void {
    if (this.categoriaForm.valid) {
      const formValues = this.categoriaForm.value;
      this.requestForUpdate(formValues);
    } else {
      this.categoriaForm.markAllAsTouched();
    }
  }
  requestForCreate(categoria: Categoria): void {
    this.categoriaService.create(categoria)
      .subscribe(() => {
        Swal.fire(
          'Categoria creada!',
          'Cateegoria creada exitosamente.',
          'success'
        )
        this.getAll();
        this.categoriaForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al crear categoria!",
          });
          console.log(error)
        });
        this.registerDialog = false;
  }

  requestForUpdate(categoria: Categoria): void {
    this.categoriaService.update(categoria)
      .subscribe(() => {
        Swal.fire(
          'Actualización exitosa!',
          'Se actualizó la información de la categoria.',
          'success'
        )
        this.getAll();
        this.categoriaForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al crear categoria.",
          });
          console.log(error)
        });
        this.updateDialog = false;
  }

  onDelete(id: any): void {
    var parseId = parseInt(id)
    Swal.fire({
      icon: 'info',
      title: 'Esta seguro de eliminar esta categoria?',
      showDenyButton: true,
      confirmButtonText: 'Si, eliminar',
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.categoriaService.delete(id).subscribe(() => {
          Swal.fire('Categoria eliminada!', '', 'success')

          this.getAll();
        })
      } else if (result.isDenied) {
        Swal.fire('No se guardaron los cambios', '', 'info')
      }
    })
  }
  loadUser(id: any){
    var parseId = parseInt(id);
    let currentUser = this.categoria.find((p) =>{
      return p.idcategoria === id;
    });
    this.categoriaForm.patchValue({
      idcategoria: currentUser?.idcategoria,
      nombre: currentUser?.nombre,  
      descripcion: currentUser?.descripcion,
      estado: currentUser?.estado,
    })
  }

  openRegister() {
    this.registerDialog = true;
  }

  openUpdate() {
    this.updateDialog = true;
  }

  onCloseDialog() {
    this.categoriaForm.reset();
  }

  onClose() {
    this.registerDialog = false;
    this.updateDialog = false;
    this.onCloseDialog();
  }

  boolToString(value: boolean): string {
    return value ? 'Activo' : 'Desactivado';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
