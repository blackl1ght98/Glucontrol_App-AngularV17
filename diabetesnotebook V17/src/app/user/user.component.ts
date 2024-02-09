import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IUserLoginResponse } from '../interfaces/loginResponse.interface';
import { AuthServiceService } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import NavbarComponent from './global/navbar/navbar.component';
import AppComponent from '../app.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    RouterOutlet,
    AppComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export default class UserComponent {
  usuarioLogeado: IUserLoginResponse | null = null;

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.recibirUsuarioLogeado();
  }

  recibirUsuarioLogeado() {
    this.authService.user.subscribe((user: IUserLoginResponse | null) => {
      this.usuarioLogeado = user;
    });
  }
}
