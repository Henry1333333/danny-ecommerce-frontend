import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReporteVentas, Ventas } from '../model/ventas';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl = 'http://localhost:8070/venta/';
  constructor(private http:HttpClient) { }

  get(): Observable<ReporteVentas[]>{
    return this.http.get<ReporteVentas[]>(`${this.baseUrl}`+'listar');
  }
  
  listarVentas(fechaInicio?: string, fechaFin?: string): Observable<ReporteVentas[]> {
    const params: any = {};
    if (fechaInicio) {
      params.fechaInicio = fechaInicio;
    }
    if (fechaFin) {
      params.fechaFin = fechaFin;
    }

    return this.http.get<ReporteVentas[]>(`${this.baseUrl}listarPorFecha`, { params });
  }

  create(venta: Ventas): Observable<Ventas>{
    const body = venta;
    return this.http.post<Ventas>(`${this.baseUrl}registrar`,body);
  }




}
