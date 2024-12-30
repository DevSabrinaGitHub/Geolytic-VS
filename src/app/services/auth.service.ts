import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    // private httpService: HttpService,
    //  private router: Router,
    private HttpClient:HttpClient
    ){ }


login(datos: any){
      return this.HttpClient.post(environment.api+'/login' ,datos);
}

CambioPass(datos: any){
  return this.HttpClient.post(environment.api+'/cambiopass' ,datos);
}


getQuejas(){
  return this.HttpClient.get(environment.api+'/quejas');
}



getNodos(){
  return this.HttpClient.get(environment.api+'/nodos');
}

getSource(dato:any){
  return this.HttpClient.get(environment.api+'/source/'+dato);
}

getCapa(datos: any){
  return this.HttpClient.post(environment.api+'/capa',datos);
}

saveAgendas(datos:any){
return this.HttpClient.post(environment.api+'/agendas', datos);
}

editAgendas(datos:any){
return this.HttpClient.put(environment.api+'/agenda', datos);
}

delAgenda(id:any){
return this.HttpClient.delete(environment.api+'/agenda/'+id);
}
/////////////////////////////////
/////////////usuarios///////////
/////////////////////////////////

/////////////////////////////////
/////////////capas///////////
/////////////////////////////////
getCapas(datos){
  return this.HttpClient.post(environment.api + '/capas', { filtros: datos });
}

altaCapas(datos:any){
  return this.HttpClient.post(environment.api+'/reactivar_geometry_estado', datos);
}

bajaCapas(datos:any){
  return this.HttpClient.post(environment.api+'/geometry_estado', datos);
}

getCapaId(id:any){
return this.HttpClient.get(environment.api+'/capa/'+id);
}

saveCapas(datos:any){
return this.HttpClient.post(environment.api+'/capas', datos);
}

editCapas(datos:any){
return this.HttpClient.put(environment.api+'/capa', datos);
}

delCapa(id:any){
return this.HttpClient.delete(environment.api+'/capa/'+id);
}

// /////////roles/////////////////
getRoles(): Observable<any> {
  return this.HttpClient.get(environment.api+'/roles');
}

getRol(id: number): Observable<any> {
  return this.HttpClient.get(environment.api+'/roles/'+id);
}

createRol(rol: any): Observable<any> {
  return this.HttpClient.post<any>(environment.api+'/roles/', rol);
}

updateRol(rol: any): Observable<any> {
  return this.HttpClient.put<any>(environment.api+`/roles/${rol.id_rol}`, rol);
}

deleteRol(id: number): Observable<any> {
  return this.HttpClient.delete<any>(environment.api+`roles/${id}`);
}
///////////////////////////////

getUsuarios(): Observable<any> {
  return this.HttpClient.get(environment.api+'/usuarios');
}

getUsuario(id: number): Observable<any> {
  return this.HttpClient.get(environment.api+'/usuarios/'+id);
}

createUsuario(usuario: any): Observable<any> {
  return this.HttpClient.post<any>(environment.api+'/usuarios/', usuario);
}

updateUsuario(id: number, usuario: any): Observable<any> {
 return this.HttpClient.put<any>(environment.api+`/usuarios/${usuario.id_usuario}`, usuario);
}

deleteUsuario(id: number): Observable<any> {
  return this.HttpClient.delete<any>(environment.api+`usuarios/${id}`);
}

resetPassUsuario(id: number): Observable<any> {
  return this.HttpClient.get(environment.api+'/usuarios/reset-password/'+id);
}

registerUsuario(usuario: any): Observable<any> {
  const defaultRole = 3; // ID del rol por defecto
  const defaultDominio = 1; // ID del dominio por defecto
  usuario.id_rol = defaultRole;
  usuario.id_dominio = defaultDominio;
  return this.HttpClient.post<any>(environment.api+'/usuarios/register', usuario);
}

recuperoUsuario(usuario: any): Observable<any> {
  const defaultRole = 3; // ID del rol por defecto
  const defaultDominio = 1; // ID del dominio por defecto
  usuario.id_rol = defaultRole;
  usuario.id_dominio = defaultDominio;
  return this.HttpClient.post<any>(environment.api+'/usuarios/recupero', usuario);
}
}
