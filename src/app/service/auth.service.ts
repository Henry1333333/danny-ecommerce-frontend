import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Credenciales } from '../model/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient ) { }
  login(creds: Credenciales) {

    return this.http.post('http://localhost:8070/authenticate', creds, {
      observe: 'response'

    }).pipe(map((response: HttpResponse<any>) => {
      const body = response.body;
      const headers = response.body;
      console.log(response.body);

      localStorage.setItem('token', headers);
      return body;
    }))

  }

  getToken() {
    return localStorage.getItem('token');

  }
  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  public remove(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }


  generateToken(Credenciales:any){
    return this .http.post('http://localhost:8070/authenticate', Credenciales)
  }

  //inicio de sesion
  public loginUser(token:any){
    localStorage.setItem('token', token);
  }

  public isLogged(){
    let tokenStr = localStorage.getItem('token');
    if(tokenStr == undefined || tokenStr == '' || tokenStr == null){
      return false;
    }else{
      return true; 
    }
  }

  public setUser(user: any){
    localStorage.setItem('user', JSON.stringify(user));
    
  }
  
  public getUser(){
    let userStr = localStorage.getItem('user');
    if(userStr != null){
      return JSON.parse(userStr);
    }else{
      this.remove();
      return null;
    }
  }

  public getUserRol(){
    let user = this.getUser();
    
    return user.authorities[0].authority;
  }

  public getCurrentUser(){
    return this.http.get('http://localhost:8070/actual-usuario')
  }
}
