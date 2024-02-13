import { Component } from '@angular/core';
import RecoverPassComponent from './recover-pass/recover-pass.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shared',
  standalone: true,
  imports: [RecoverPassComponent, NotfoundComponent, RouterOutlet],
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.css',
})
export default class SharedComponent {}
