import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto';
import { ProductoList } from '../model/productolist';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8070/producto/';
  constructor(private http:HttpClient) { }

  get(): Observable<ProductoList[]>{
    return this.http.get<ProductoList[]>(`${this.baseUrl}`+'listar');
  }

  create(producto: Producto): Observable<Producto>{
    const body = producto;
    return this.http.post<Producto>(`${this.baseUrl}crear`,body);
  }

  update(producto: Producto): Observable<Producto>{
    const body = producto;
    return this.http.put<Producto>(`${this.baseUrl}actualizar`,body);
  }

  delete(id: String): Observable<Producto>{
    return this.http.delete<Producto>(`${this.baseUrl}desactivar/${id}`)
  }

  find(id: String): Observable<Producto>{
    return this.http.get<Producto>(`${this.baseUrl}encontrar/${id}`)
  }
}
