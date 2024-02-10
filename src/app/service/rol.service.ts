import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rol } from '../model/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private baseUrl = 'http://localhost:8070/rol/';
  constructor(private http:HttpClient) { }

  get(): Observable<rol[]>{
    return this.http.get<rol[]>(`${this.baseUrl}`+'listar');
  }

  create(usuario: rol): Observable<rol>{
    const body = usuario;
    return this.http.post<rol>(`${this.baseUrl}registrar`,body);
  }

  update(usuario: rol): Observable<rol>{
    const body = usuario;
    return this.http.put<rol>(`${this.baseUrl}actualizar`,body);
  }

  delete(id: String): Observable<rol>{
    return this.http.delete<rol>(`${this.baseUrl}desactivar/${id}`)
  }
}
