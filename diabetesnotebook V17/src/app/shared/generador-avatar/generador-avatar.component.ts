import { Component, EventEmitter, Output } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { CommonModule } from '@angular/common';
import LazyLoadImageDirective from '../directives/lazy-load-image.directive';

@Component({
  selector: 'app-generador-avatar',
  standalone: true,
  imports: [CommonModule, LazyLoadImageDirective],
  templateUrl: './generador-avatar.component.html',
  styleUrl: './generador-avatar.component.css',
})
export default class GeneradorAvatarComponent {
  @Output() avatarGenerado: EventEmitter<string> = new EventEmitter<string>();

  avatar: string = '';
  defaultAvatar: string = 'assets/avatar.png';

  constructor(private avatarService: AvatarService) {}

  generarAvatar() {
    console.log('GenerarAvatar llamado');
    this.avatar = this.avatarService.getRandomAvatar();
    this.avatarGenerado.emit(this.avatar);
  }
}
