import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Signal } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import FormComponent from './components/form/form.component';
import InfoComponent from './components/info/info.component';
import LazyLoadImageDirective from '../shared/directives/lazy-load-image.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    FormComponent,
    InfoComponent,
    LazyLoadImageDirective,
  ],
  providers: [HttpClient, AuthServiceService],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent implements OnInit {
  title = 'login-GluControl';
  constructor(private titleService: Title) {}
  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
