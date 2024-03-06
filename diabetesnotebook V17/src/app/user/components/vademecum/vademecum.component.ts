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
    email: '',
    sexo: Sexo.hombre,
    edad: 0,
    peso: 0,
    altura: 0,
    actividad: '',
    tipoDiabetes: '',
    medicacion: [],
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
    this.userService.getUserById(this.authService.userValue!.id).subscribe({
      next: (res) => {
        this.usuario = {
          id: res.id,
          avatar: res.avatar,
          userName: res.userName,
          nombre: res.nombre,
          primerApellido: res.primerApellido,
          segundoApellido: res.segundoApellido,
          email: res.email,
          sexo: res.sexo,
          edad: res.edad,
          peso: res.peso,
          altura: res.altura,
          actividad: res.actividad,
          tipoDiabetes: res.tipoDiabetes,
          medicacion: res.usuarioMedicacions!.map(
            (m) => m.idMedicacionNavigation.nombre
          ),
          insulina: res.insulina,
        };
        this.medicamentosFromBackend = this.usuario.medicacion; // Asignar los medicamentos del usuario a medicamentosFromBackend
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

    if (!this.usuario.medicacion.includes(nuevoMedicamentoLowerCase)) {
      this.usuario.medicacion.push(nuevoMedicamentoLowerCase);

      this.userService.actualizarUsuario(this.usuario).subscribe({
        next: (res) => {
          this.error = '';
          this.nuevoMedicamento = '';
          this.getUserData(); // Actualizar los datos del usuario después de la actualización
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
    const index = this.usuario.medicacion.findIndex(
      (med) => med.toLocaleLowerCase() === medicamentoAEliminarLowerCase
    );

    if (index !== -1) {
      this.usuario.medicacion.splice(index, 1);

      this.userService.actualizarUsuario(this.usuario).subscribe({
        next: (res) => {
          console.log('Medicamento eliminado:', medicamentoAEliminar);
          this.error = '';
          this.getUserData(); // Actualizar los datos del usuario después de la actualización
        },
        error: (err) => {
          console.error('Error al actualizar el usuario:', err);
        },
      });
    } else {
      this.error = 'El medicamento no existe en la lista.';
    }
  }
}
