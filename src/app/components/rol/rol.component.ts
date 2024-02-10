import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
  providers: [MessageService]
})
export class RolComponent {
  rolForm!: FormGroup;
  rol: rol[] = [];
  registerDialog: boolean = false;
  updateDialog: boolean = false;
  constructor(private rolService: RolService, private messageService: MessageService){
  }
  ngOnInit(): void {
    this.rolForm = this.buildForm();
    this.getAll();
  }

  buildForm(): FormGroup {
    return new FormGroup({
      rolId: new FormControl(''),
      rolNombre: new FormControl('', Validators.required),
    })
  }

  getAll() {
        this.rolService.get().subscribe((data) => {
      this.rol = data;
    })
  }

  crear(): void {
    if (this.rolForm.valid) {
      const formValues = this.rolForm.value;
      this.requestForCreate(formValues);
    } else {
      this.rolForm.markAllAsTouched();
    }
  }

  actualizar(): void {
    if (this.rolForm.valid) {
      const formValues = this.rolForm.value;
      this.requestForUpdate(formValues);
    } else {
      this.rolForm.markAllAsTouched();
    }
  }

  requestForCreate(categoria: rol): void {
    this.rolService.create(categoria)
      .subscribe(() => {
        Swal.fire(
          'Rol creado!',
          'Rol creada exitosamente.',
          'success'
        )
        this.getAll();
        this.rolForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al crear rol!",
          });
          console.log(error)
        });
        this.registerDialog = false;
  }

  requestForUpdate(categoria: rol): void {
    this.rolService.update(categoria)
      .subscribe(() => {
        Swal.fire(
          'Actualización exitosa!',
          'Se actualizó la información de la categoria.',
          'success'
        )
        this.getAll();
        this.rolForm.reset();
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
        this.rolService.delete(id).subscribe(() => {
          Swal.fire('Categoria eliminada!', '', 'success')
          console.log(id)
          this.getAll();
        })
      } else if (result.isDenied) {
        Swal.fire('No se guardaron los cambios', '', 'info')
        
      }
    })
  }
  loadUser(id: any){
    var parseId = parseInt(id);
    let currentUser = this.rol.find((p) =>{
      return p.idrol === id;
    });
    this.rolForm.patchValue({
      rolId: currentUser?.idrol,
      rolNombre: currentUser?.nombrerol 
    })
  }

  openRegister() {
    this.registerDialog = true;
  }

  openUpdate() {
    this.
    updateDialog = true;
  }
  onCloseDialog() {
    this.rolForm.reset();
  }
  onClose() {
    this.registerDialog = false;
    this.updateDialog = false;
    this.onCloseDialog();
  }
}
