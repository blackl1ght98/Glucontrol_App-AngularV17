import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IUserLoginResponse } from '../../../interfaces/loginResponse.interface';
import { AuthServiceService } from '../../../services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export default class NavbarComponent {
  @Input() usuarioLogeado: IUserLoginResponse | null = null;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.usuarioLogeado = user;
    });
  }

  logout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}
