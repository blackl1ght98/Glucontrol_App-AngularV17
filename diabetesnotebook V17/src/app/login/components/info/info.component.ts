import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from '../../../services/auth-service.service';
import FormComponent from '../form/form.component';
import LazyLoadImageDirective from '../../../shared/directives/lazy-load-image.directive';

@Component({
  selector: 'login-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FormComponent,
    LazyLoadImageDirective,
  ],
  providers: [HttpClient, AuthServiceService],

  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export default class InfoComponent {}
