import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IRecover } from '../../interfaces/loginResponse.interface';
import { RecordarPassService } from '../../services/recordar-pass.service';
import { FormsModule } from '@angular/forms';
import LazyLoadImageDirective from '../directives/lazy-load-image.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recover-pass',
  standalone: true,
  imports: [LazyLoadImageDirective, FormsModule, CommonModule],
  templateUrl: './recover-pass.component.html',
  styleUrl: './recover-pass.component.css',
})
export default class RecoverPassComponent {
  constructor(
    private recover: RecordarPassService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.token = params['token'];
      console.log(this.token);
    });
  }

  test() {
    this.router.navigate(['/login']);
  }

  token: string = '';
  newPass: string = '';
  newPass2: string = '';
  error: string = '';
  recuperarPass() {
    const datoLogin: IRecover = {
      token: this.token,
      newPass: this.newPass,
    };
    console.log(datoLogin);

    this.recover.recordarPass(datoLogin).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        console.log(res);
      },
      error: (err) => {
        this.error = err.error;
        console.error(this.error);
      },
    });
  }
}
