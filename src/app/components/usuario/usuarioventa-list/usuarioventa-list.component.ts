import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { UsuarioVenta } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
    selector: 'app-usuarioventa-list',
    templateUrl: './usuarioventa-list.component.html',
    styleUrls: ['./usuarioventa-list.component.scss'],
})
export class UsuarioventaListComponent {
    clienteId!: number;
    usuarioVenta: UsuarioVenta[] = [];

    constructor(private usuarioService: UsuarioService) {}
    ngOnInit(): void {
        let cliente = this.getCliente();
        if (cliente) {
            this.clienteId = cliente['id'];
        }
        const id = this.clienteId;
        this.usuarioService.listarVentasPorId(id).subscribe((data) => {
            this.usuarioVenta = data;
        });
    }

    public getCliente() {
        let userStr = localStorage.getItem('user');
        if (userStr != null) {
            return JSON.parse(userStr);
        } else {
            return null;
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
