import { Component, signal } from '@angular/core';
import { Sexo } from '../../../enums/register.enum';
import {
  IMedicamento,
  IRespuestaServicio,
} from '../../../interfaces/medicamento.interface';
import { IUsuarioUpdate } from '../../../interfaces/usuario.interface';
import { AuthServiceService } from '../../../services/auth-service.service';
import { UsuarioService } from '../../../services/usuario.service';
import { VademecumService } from '../../../services/vademecum.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroGenericosPipe } from '../../../pipes/filtro-genericos.pipe';
import { FiltroSinRecetaPipe } from '../../../pipes/filtro-sin-receta.pipe';
import LazyLoadImageDirective from '../../../shared/directives/lazy-load-image.directive';

@Component({
  selector: 'app-vademecum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FiltroGenericosPipe,
    FiltroSinRecetaPipe,
    LazyLoadImageDirective,
  ],
  templateUrl: './vademecum.component.html',
  styleUrl: './vademecum.component.css',
})
export default class VademecumComponent {
  medicamentosFromBackend: string[] = [];
  usuario: IUsuarioUpdate = {
    avatar: '',
    userName: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    sexo: Sexo.hombre,
    edad: 0,
    peso: 0,
    altura: 0,
    actividad: '',
    tipoDiabetes: '',
    medicacion: '',
    insulina: false,
  };

  medicamentoSeleccionado: string = '';
  medicamentosArray: IMedicamento[] = [];
  Receta: boolean = true;
  Genericos: boolean = false;
  nuevoMedicamento: string = '';
  accModal: boolean = false;
  error: string = '';

  constructor(
    private vademecum: VademecumService,
    private userService: UsuarioService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    console.log(this.usuario);
  }

  modalAcc() {
    if (this.accModal) {
      this.accModal = false;
    } else {
      this.accModal = true;
    }
    console.log(this.accModal);
  }

  medicamentoChange() {
    if (this.medicamentoSeleccionado) {
      this.buscarMedicamentos(this.medicamentoSeleccionado);
    }
  }

  buscarMedicamentos(nombre: string) {
    nombre = this.medicamentoSeleccionado;
    this.vademecum.getMedicamentoInfo(nombre).subscribe({
      next: (res: IRespuestaServicio) => {
        this.medicamentosArray = res.resultados;
        console.log(this.medicamentosArray);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getUserData() {
    this.userService
      .getUsuarioYPersonaInfo(this.authService.userValue!.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.usuario = {
            id: res[0].id,
            avatar: res[0].avatar,
            userName: res[0].userName,
            nombre: res[1].nombre,
            primerApellido: res[1].primerApellido,
            segundoApellido: res[1].segundoApellido,
            sexo: res[1].sexo,
            edad: res[1].edad,
            peso: res[1].peso,
            altura: res[1].altura,
            actividad: res[1].actividad,
            tipoDiabetes: res[1].tipoDiabetes,
            medicacion: res[1].medicacion,
            insulina: res[1].insulina,
          };
          this.medicamentosFromBackend = this.usuario.medicacion.split(',');
          console.log(this.usuario);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addMedicamento() {
    const nuevoMedicamentoLowerCase = this.nuevoMedicamento.toLocaleLowerCase();

    if (this.nuevoMedicamento === '') {
      this.error = 'El campo no puede estar vacío.';
      return;
    }
    if (!this.medicamentosFromBackend.includes(nuevoMedicamentoLowerCase)) {
      this.medicamentosFromBackend.push(nuevoMedicamentoLowerCase);
      this.nuevoMedicamento = '';
      this.usuario.medicacion = this.medicamentosFromBackend.join(',');

      this.userService.actualizarUsuario(this.usuario).subscribe({
        next: (res) => {
          this.error = '';
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.error = 'El medicamento ya existe en la lista.';
    }
  }

  eliminarMedicamento(medicamentoAEliminar: string) {
    const medicamentoAEliminarLowerCase =
      medicamentoAEliminar.toLocaleLowerCase();
    const existeMedicamento = this.medicamentosFromBackend.includes(
      medicamentoAEliminarLowerCase
    );

    if (!existeMedicamento) {
      this.error = 'El medicamento no existe en la lista.';
      return;
    }

    this.medicamentosFromBackend = this.medicamentosFromBackend.filter(
      (med) => med.toLocaleLowerCase() !== medicamentoAEliminarLowerCase
    );

    this.usuario.medicacion = this.medicamentosFromBackend.join(',');
    this.userService.actualizarUsuario(this.usuario).subscribe({
      next: (res) => {
        console.log('Medicamento eliminado:', medicamentoAEliminar);
        this.nuevoMedicamento = '';
        this.error = '';
      },
      error: (err) => {
        console.error('Error al actualizar el usuario:', err);
      },
    });
  }
}
