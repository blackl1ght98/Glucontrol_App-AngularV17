import { Routes } from '@angular/router';
import LoginComponent from './login/login.component';
import RegisterComponent from './register/register.component';
import MedicionesComponent from './user/components/mediciones/mediciones.component';
import MisDatosComponent from './user/components/mis-datos/mis-datos.component';
import VademecumComponent from './user/components/vademecum/vademecum.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import RecoverPassComponent from './shared/recover-pass/recover-pass.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    title: 'Inicio | Glucontrol ',
    loadComponent: () => import('./login/login.component'),
    children: [{ path: '', component: LoginComponent }],
  },
  {
    path: 'register',
    title: 'Registro | Glucontrol ',
    loadComponent: () => import('./register/register.component'),
    children: [{ path: '', component: RegisterComponent }],
  },
  {
    path: 'user-dashboard',
    title: 'Dashboard | Glucontrol ',
    loadComponent: () => import('./user/user.component'),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'mis-datos', pathMatch: 'full' },

      {
        path: 'mis-datos',
        title: 'Mis datos | Glucontrol ',
        loadComponent: () =>
          import('./user/components/mis-datos/mis-datos.component'),
      },

      {
        path: 'mediciones',
        title: 'Mediciones | Glucontrol ',
        loadComponent: () =>
          import('./user/components/mediciones/mediciones.component'),
      },

      {
        path: 'vademecum',
        title: 'Vademecum | Glucontrol',
        loadComponent: () =>
          import('./user/components/vademecum/vademecum.component'),
      },
    ],
  },
  {
    path: 'shared',
    loadComponent: () => import('./shared/shared.component'),
    children: [
      {
        path: 'recover-pass/:token',
        title: 'Recuperar Contraseña | Glucontrol',
        loadComponent: () =>
          import('./shared/recover-pass/recover-pass.component'),
      },
      {
        path: '**',
        component: NotfoundComponent,
      },
    ],
  },
];
