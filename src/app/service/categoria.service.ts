import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../model/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = 'http://localhost:8070/categoria/';
  constructor(private http:HttpClient) { }

  get(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(`${this.baseUrl}`+'listar');
  }

  create(categoria: Categoria): Observable<Categoria>{
    const body = categoria;
    return this.http.post<Categoria>(`${this.baseUrl}registrar`,body);
  }

  update(categoria: Categoria): Observable<Categoria>{
    const body = categoria;
    return this.http.put<Categoria>(`${this.baseUrl}actualizar`,body);
  }

  delete(id: String): Observable<Categoria>{
    return this.http.delete<Categoria>(`${this.baseUrl}desactivar/${id}`)
  }
}
