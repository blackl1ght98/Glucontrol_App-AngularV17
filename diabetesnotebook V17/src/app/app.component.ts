import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import NavbarComponent from './user/global/navbar/navbar.component';
import UserComponent from './user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export default class AppComponent {
  title = 'diabetesnotebook';
}
