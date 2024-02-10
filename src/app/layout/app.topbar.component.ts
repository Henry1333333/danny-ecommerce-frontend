import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    ConfirmationService,
    MenuItem,
    Message,
    MessageService,
} from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Sidebar } from 'primeng/sidebar';
import { Credenciales } from '../model/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../model/usuario';
import { ShoppingcartService } from '../service/shoppingcart.service';
import { ProductoCarrito } from '../model/productcarrito';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService, ConfirmationService],
})
export class AppTopBarComponent {
    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    loginDialog: boolean = false;
    registerDialog: boolean = false;
    items!: MenuItem[];
    sidebarVisible: boolean = false;
    closeCallback(e): void {
        this.sidebarRef.close(e);
    }
    valCheck: string[] = ['remember'];
    password!: string;
    loginForm!: FormGroup;
    msgs: Message[] = [];
    user!: String;
    usernameValid!: String;
    creds: Credenciales = {
        usuario: '',
        contrasena: '',
    };
    position: string = 'center';
    usuarioForm!: FormGroup;
    numeroEnCarrito: number = 0;
    showOrderList = false;
    logeado:boolean =true;
    productosEnCarrito: ProductoCarrito[] = [];
    toggleOrderList() {
      this.showOrderList = !this.showOrderList;
    }
    constructor(
        private carritoService: ShoppingcartService,
        private router: Router,
        public layoutService: LayoutService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private serviceMessage: MessageService,
        private usuarioService: UsuarioService
    ) {}
    submitted: boolean = false;

    ngOnInit(): void {
        this.loginForm = this.buildForm();
        this.usuarioForm = this.userForm();
        let user = this.getUser();
        if (user) {
            this.user = user['username'];
        }
        this.carritoService.productosEnCarrito$.subscribe((productos) => {
            this.numeroEnCarrito = productos.length;
        });
        this.getCarrito();
    }
    mostrarPassword = false;

    //usuario
    userForm(): FormGroup {
        return new FormGroup({
            id: new FormControl(''),
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            telefono: new FormControl('', Validators.required),
            dni: new FormControl('', Validators.required),
            direccion: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            perfil: new FormControl(''),
        });
    }

    getCarrito():void{
      this.productosEnCarrito = this.carritoService.obtenerProductosEnCarrito();
    };
    
    obtenerPrecioTotalCarrito(): number {
        return this.carritoService.obtenerPrecioTotal();
    }
    crearCuenta(): void {
        if (this.usuarioForm.valid) {
            const formValues = this.usuarioForm.value;
            this.requestForCreate(formValues);
        } else {
            this.usuarioForm.markAllAsTouched();
        }
    }

    requestForCreate(usuario: Usuario): void {
        this.usuarioService.create(usuario).subscribe(
            () => {
                Swal.fire(
                    'Cuenta creada!',
                    'ahora puedes iniciar sesión!',
                    'success'
                );
            },
            (error) => {}
        );
        this.registerDialog = false;
        this.usuarioForm.reset();
    }

    //login ----------
    buildForm(): FormGroup {
        return new FormGroup({
            usuario: new FormControl('', Validators.required),
            contrasena: new FormControl('', Validators.required),
        });
    }

    get usernameForm() {
        return this.loginForm.get('usuario');
    }

    get passwordForm() {
        return this.loginForm.get('contrasena');
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const formValues = this.loginForm.value;
            this.login(formValues);
            console.log(this.loginForm.value);
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    public getUser() {
        let userStr = localStorage.getItem('user');
        if (userStr != null) {
            this.logeado = false;
            return JSON.parse(userStr);
        } else {
            return null;
        }
    }

    login(form: any) {
        this.authService.generateToken(this.creds).subscribe(
            (data: any) => {
                console.log(data);
                this.authService.loginUser(data.token);
                this.authService.getCurrentUser().subscribe((user: any) => {
                    this.authService.setUser(user);
                    console.log(user);
                    if (this.authService.getUserRol() == 'admin') {
                        window.location.href = '';
                    } else if (this.authService.getUserRol() == 'cliente') {
                        window.location.href = '';
                    } else {
                        window.location.href = '';
                        this.authService.remove();
                        this.authService.logout();
                    }
                });
            },
            (error) => {
                this.serviceMessage.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error! ',
                    detail: 'Usuario Inválido',
                });
            }
        );
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
    }

    onCloseDialog() {
        this.loginForm.reset();
        this.usuarioForm.reset();
        this.submitted = false;
    }

    onClose() {
        this.registerDialog = false;
        this.usuarioForm.reset();
    }

    //modal --------------
    openNew() {
        this.loginDialog = true;
    }
    openRegister() {
        this.registerDialog = true;
        this.loginDialog = false;
    }
    visibleBar() {
        this.sidebarVisible = true;
    }
    novisibleBar() {
        this.sidebarVisible = false;
    }

    // Método para mostrar u ocultar el sidebar

    onLogout(): void {
        Swal.fire({
            title: '¿Esta seguro de cerrar sesión?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
            imageUrl:
                'http://www.efisioterapia.net/tienda/modules/dbblog/views/img/post/rehabilitacion-veterinaria-magnetoterapia-perros.jpg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                this.logout();
                this.router.navigate(['']);
            }
        });
    }

    islogged() {
        const usuarioAlmacenado = localStorage.getItem('user');
        if (usuarioAlmacenado) {
            this.visibleBar();
        } else {
            this.openNew();
        }
    }

    confirmPosition(position: string) {
        this.position = position;

        this.confirmationService.confirm({
            message: 'Esta seguro de cerrar sesión?',
            header: 'Cerrar Sesión',
            icon: 'pi pi-info-circle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.logout();
                this.router.navigate(['']);
                this.serviceMessage.add({
                    severity: 'success',
                    summary: '',
                    detail: 'Cerraste sesión',
                });
                this.sidebarVisible = false;
            },
            key: 'positionDialog',
        });
    }
}
