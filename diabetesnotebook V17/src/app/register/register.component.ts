import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Sexo, Actividad, TipoDiabetes } from '../enums/register.enum';
import { IFinalRegister } from '../interfaces/finalregister.interface';
import { IRegister } from '../interfaces/register.interface';
import { AuthServiceService } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Paso1Component from './components/paso1/paso1.component';
import Paso2Component from './components/paso2/paso2.component';
import Paso3Component from './components/paso3/paso3.component';
import LazyLoadImageDirective from '../shared/directives/lazy-load-image.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Paso1Component,
    Paso2Component,
    Paso3Component,
    LazyLoadImageDirective,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export default class RegisterComponent {
  public Sexo = Sexo;
  public Actividad = Actividad;
  public TipoDiabetes = TipoDiabetes;
  error: string = '';
  datosRegistro: IRegister = {
    username: '',
    avatar: '',
    nombre: '',
    apellido: '',
    apellido2: '',
    email: '',
    password: '',
    password2: '',
    mediciones: {
      edad: 0,
      peso: 0,
      altura: 0,
      sexo: this.Sexo.hombre,
      actividad: this.Actividad.sedentario,
      tipoDiabetes: {
        tipo: this.TipoDiabetes.tipo1,
        medicacion: [],
        insulina: false,
      },
    },
  };

  retrocederPaso(): void {
    if (this.paso > 1) {
      this.datosRegistro.mediciones.tipoDiabetes.medicacion = [];
      this.paso--;
    }
  }
  paso: number = 1;

  siguientePaso(info: IRegister): void {
    //this.datosRegistro = info;  SE CARGA TODO EL OBJETO;
    Object.assign(this.datosRegistro, info); // SE CARGA SOLO LA PARTE QUE SE HA MODIFICADO
    console.log(this.datosRegistro);
    if (this.paso < 3) {
      this.paso++;
    }
  }

  constructor(
    private registerService: AuthServiceService,
    private router: Router
  ) {}

  registroUsuario(datosFinales: IFinalRegister) {
    this.registerService.registerUser(datosFinales).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error.errors.email;
        console.log(err);
      },
      complete: () => console.log('Operation completed'),
    });
  }
}
