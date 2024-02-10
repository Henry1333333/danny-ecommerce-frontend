import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario, UsuarioVenta } from '../model/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8070/usuarios/';
  constructor(private http:HttpClient) { }

  get(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.baseUrl}`+'listar');
  }

  listarVentasPorId(id: number): Observable<UsuarioVenta[]> {
    const url = `${this.baseUrl}listarPorId/${id}`;
    return this.http.get<UsuarioVenta[]>(url);
  }

  create(usuario: Usuario): Observable<Usuario>{
    const body = usuario;
    return this.http.post<Usuario>(`${this.baseUrl}agregar`,body);
  }

  delete(id: String): Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.baseUrl}desactivar/${id}`)
  }

  update(usuario: Usuario): Observable<Usuario>{
    const body = usuario;
    return this.http.put<Usuario>(`${this.baseUrl}actualizar`,body);
  }
}
