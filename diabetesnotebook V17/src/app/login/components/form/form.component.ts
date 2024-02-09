import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IRecover, ILogin } from '../../../interfaces/loginResponse.interface';
import { AuthServiceService } from '../../../services/auth-service.service';
import { RecordarPassService } from '../../../services/recordar-pass.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import ModalComponent from '../../../shared/modal/modal.component';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, RouterLink],
  //providers: [HttpClient, AuthServiceService],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export default class FormComponent {
  usuario: string = '';
  password: string = '';
  mail: string = '';
  error: string = '';
  icono: string = 'assets/iconoEmail.svg';
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private recordarService: RecordarPassService
  ) {}

  recordar: boolean = false;
  mostrarModal: boolean = false;
  mensajeModal: string = '';
  accModal: boolean = false;
  recuperarPass: IRecover = {
    token: '',
    newPass: '',
  };

  verOlvidado() {
    this.recordar = true;
  }

  modalAcc() {
    if (this.accModal) {
      this.accModal = false;
    } else {
      this.accModal = true;
    }
    console.log(this.accModal);
  }

  login() {
    const datoLogin: ILogin = {
      UserName: this.usuario,
      Password: this.password,
    };

    this.authService.loginUser(datoLogin).subscribe({
      next: (res) => {
        this.router.navigate(['/user-dashboard']);
      },
      error: (err) => {
        this.error = err.error;
        console.log(this.error);
      },
    });
  }

  recordarPassword() {
    this.recordar = false;
    this.mensajeModal =
      'Tu solicitud de recuperación de contraseña ha sido enviada. Por favor, revisa tu correo electrónico.';
    this.recordarService.recordarPassLogin(this.mail).subscribe({
      next: (res) => {
        console.log('Ha salido todo bien', res);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.mostrarModal = true;
  }

  formularioInvalido() {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(this.mail)) {
      return true;
    }
    return false;
  }
}
