import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Envio } from '../model/envio';
import { Observable } from 'rxjs';
import { Recogertienda } from '../model/recogertienda';

@Injectable({
  providedIn: 'root'
})
export class TipoentregaService {

  
  private baseUrl = 'http://localhost:8070/tipoEntrega/';
  constructor(private http:HttpClient) { }

  registerEnvio(envio: Envio): Observable<Envio>{
    const body = envio;
    return this.http.post<Envio>(`${this.baseUrl}registrarEnvio`,body);
  }

  registerEntregaTienda(recogertienda: Recogertienda): Observable<Recogertienda>{
    const body = recogertienda;
    return this.http.post<Recogertienda>(`${this.baseUrl}registrarRecogerTienda`,body);
  }
}
