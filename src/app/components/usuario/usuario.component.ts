import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Usuario } from 'src/app/model/usuario';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  providers: [MessageService],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {
  usuarioForm!: FormGroup;
  usuario: Usuario[] = [];
  registerDialog: boolean = false;
  updateDialog: boolean = false;
  selectedRol: any;
  roles: any[];
  stringRol:String;
  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private rolService: RolService) { }
  ngOnInit(): void {
    this.usuarioForm = this.buildForm();
    this.getAll();
    this.getRoles();

  }
  
  getRoles(): void {
    this.rolService.get().subscribe((data) => {
      this.roles = data.map((rol) => ({ label: rol.nombrerol, value: rol.nombrerol  })); 
    });
  }
  
  getAll(): void {
    this.usuarioService.get().subscribe((data) => {
      this.usuario = data;
    })
  }
  crear(): void {
    if (this.usuarioForm.valid) {
      const valorString: string = this.selectedRol.label
      if(valorString){
        this.usuarioForm.get('perfil')?.setValue(valorString);
      }
      const formValues = this.usuarioForm.value;
      this.requestForCreate(formValues);
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
  actualizar(): void {
    if (this.usuarioForm.valid) {
      const valorString: string = this.selectedRol.label
      if(valorString){
        this.usuarioForm.get('perfil')?.setValue(valorString);
      }
      const formValues = this.usuarioForm.value;
      this.requestForUpdate(formValues);
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
  requestForCreate(usuario: Usuario): void {
    this.usuarioService.create(usuario)
      .subscribe(() => {
        Swal.fire(
          'Registro exitoso!',
          'Usuario registrado exitosamente!',
          'success'
        )
        this.getAll();
        this.usuarioForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al registrar usuario!",
          });
          console.log(error)
        });
        this.registerDialog = false;
  }

  requestForUpdate(usuario: Usuario): void {
    this.usuarioService.update(usuario)
      .subscribe(() => {
        Swal.fire(
          'Actualización exitosa!',
          'Se actualizó la información del usuario!',
          'success'
        )
        this.getAll();
        this.usuarioForm.reset();
      },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error al registrar usuario!",
          });
          console.log(error)
        });
        this.updateDialog = false;
  }
  buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl('',),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      dni: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      perfil: new FormControl(this.stringRol, Validators.required)
    })
  }

  onDelete(id: any): void {
    var parseId = parseInt(id)
    Swal.fire({
      icon: 'info',
      title: 'Esta seguro de eliminar a este usuario?',
      showDenyButton: true,
      confirmButtonText: 'Si, eliminar',
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.usuarioService.delete(id).subscribe(() => {
          Swal.fire('Usuario eliminado!', '', 'success')

          this.getAll();
        })
      } else if (result.isDenied) {
        Swal.fire('No se guardaron los cambios', '', 'info')
      }
    })
  }
  loadUser(id: any){
    var parseId = parseInt(id);
    let currentUser = this.usuario.find((p) =>{
      return p.id === id;
    });
    this.usuarioForm.patchValue({
      id: currentUser?.id,
      username: currentUser?.username,  
      password: currentUser?.password,
      nombre: currentUser?.nombre,
      apellido:currentUser?.apellido,
      telefono: currentUser?.telefono,
      dni: currentUser?.dni,
      direccion: currentUser?.direccion,
      email: currentUser?.email,
      perfil: currentUser?.perfil

    })
  }

  onCloseDialog() {
    this.usuarioForm.reset();
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
}
