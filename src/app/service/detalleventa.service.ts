import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleVenta } from '../model/detalleventa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleventaService {

  private apiUrl = 'http://localhost:8070/detalleventa';  // Reemplaza con la URL de tu backend

  constructor(private httpClient: HttpClient) {}

  registrarMultiplesDetallesVenta(detallesVenta: DetalleVenta[]): Observable<string> {
    const body = detallesVenta;
    return this.httpClient.post<string>(`${this.apiUrl}/registrar-multiples`, body);
  }
}
