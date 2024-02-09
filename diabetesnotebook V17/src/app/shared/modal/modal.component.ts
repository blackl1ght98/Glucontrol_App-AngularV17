import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export default class ModalComponent {
  @Input() mensaje: string = '';

  @Output() cerrar = new EventEmitter<void>();

  @Input() icono: string = '';

  cerrarModal() {
    this.cerrar.emit();
  }
}
