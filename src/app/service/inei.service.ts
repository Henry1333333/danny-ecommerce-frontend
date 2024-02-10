import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IneiService {
  private departamentos = ['Lima', 'Arequipa', 'Cusco']; // Añade más según tus necesidades
  private provinciasPorDepartamento: { [departamento: string]: string[] } = {
    'Lima': ['Lima', 'Callao'],
    'Arequipa': ['Arequipa', 'Caylloma'],
    'Cusco': ['Cusco', 'Quispicanchi']
  };
  private distritosPorProvincia: { [provincia: string]: string[] } = {
    'Lima': ['Lima', 'Miraflores', 'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos'],
    'Callao': ['Callao', 'Ventanilla', 'Bellavista', 'La Perla', 'La Punta'],
    'Arequipa': ['Arequipa', 'Cerro Colorado'],
    'Caylloma': ['Chivay', 'Achoma'],
    'Cusco': ['Cusco', 'San Jerónimo'],
    'Quispicanchi': ['Urcos', 'Ccatca']
  };

  getDepartamentos(): Observable<string[]> {
    return of(this.departamentos);
  }

  getProvinciasPorDepartamento(departamento: string): Observable<string[]> {
    return of(this.provinciasPorDepartamento[departamento] || []);
  }

  getDistritosPorProvincia(provincia: string): Observable<string[]> {
    return of(this.distritosPorProvincia[provincia] || []);
  }
}
