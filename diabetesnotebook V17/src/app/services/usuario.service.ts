import { Injectable } from '@angular/core';
import { IUsuarioUpdate } from '../interfaces/usuario.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<IUsuarioUpdate> {
    const token = localStorage.getItem('token');
    console.log('esto es el token: ' + token);
    // Verifica si el token está presente en el localStorage

    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<IUsuarioUpdate>(
      `${this.API_URL}/Users/usuarioPorId/${userId}`,
      { headers: headers }
    );
  }
  confirmRegistration(userId: number, token: string): Observable<any> {
    return this.http.get(
      `${this.API_URL}/Users/validarRegistro/${userId}/${token}`
    );
  }

  actualizarUsuario(usuario: IUsuarioUpdate): Observable<IUsuarioUpdate> {
    const token = localStorage.getItem('token');
    console.log('esto es el token: ' + token);
    // Verifica si el token está presente en el localStorage

    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Convierte la propiedad medicacion a un array de strings si es necesario
    if (typeof usuario.medicacion === 'string') {
      usuario.medicacion = [usuario.medicacion];
    }

    return this.http
      .patch<IUsuarioUpdate>(
        `${this.API_URL}/Users/cambiardatosusuario`,
        usuario,
        { headers: headers }
      )
      .pipe();
  }

  cambiarPass(data: { id: number; NewPass: string }): Observable<string> {
    return this.http.put(
      `${this.API_URL}/ChangePasswordControllers/changePassword`,
      data,
      { responseType: 'text' }
    );
  }
}
