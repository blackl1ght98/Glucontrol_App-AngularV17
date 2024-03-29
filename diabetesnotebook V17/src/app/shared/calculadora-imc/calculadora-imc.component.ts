import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculadora-imc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculadora-imc.component.html',
  styleUrl: './calculadora-imc.component.css',
})
export default class CalculadoraImcComponent implements OnInit {
  @Output() emitirAltura: EventEmitter<number> = new EventEmitter();
  @Output() emitirPeso: EventEmitter<number> = new EventEmitter();

  @Input() alturaRecibida: number = NaN;
  @Input() pesoRecibido: number = NaN;

  // altura : number = 0;
  // peso : number = 0;

  get imc(): number {
    let calculo = this.calcularIMC();
    if (calculo == Infinity || Number.isNaN(calculo)) {
      return 0;
    } else {
      return Math.round(calculo);
    }
  }

  ngOnInit(): void {
    this.obtenerIMC();
  }

  obtenerIMC(): string {
    const imc = this.calcularIMC();
    if (imc < 18.5) {
      return 'assets/figures/person_thin.png';
    } else if (imc >= 18.5 && imc < 28) {
      return 'assets/figures/person_normal.png';
    } else if (imc >= 28 && imc < 38) {
      return 'assets/figures/person_fat.png';
    } else if (imc >= 38) {
      return 'assets/figures/person_ob.png';
    } else {
      return 'assets/figures/person_normal.png';
    }
  }
  imcColor(): string {
    const imc = this.calcularIMC();
    if (imc < 18.5) {
      return `#940505`;
    } else if (imc >= 18.5 && imc < 28) {
      return '#6AF2B8';
    } else if (imc >= 28 && imc < 38) {
      return '#79048B';
    } else if (imc >= 38) {
      return `#940505`;
    } else {
      return 'text-success';
    }
  }

  calcularIMC(): number {
    let alturaEnMetros = this.alturaRecibida / 100;
    return this.pesoRecibido / Math.pow(alturaEnMetros, 2);
  }

  enviarAltura() {
    this.emitirAltura.emit(this.alturaRecibida);
  }
  enviarPeso() {
    this.emitirPeso.emit(this.pesoRecibido);
  }
}
