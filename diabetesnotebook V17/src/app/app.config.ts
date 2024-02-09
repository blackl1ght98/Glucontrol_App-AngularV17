import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import {
  NGX_ECHARTS_CONFIG,
  NgxEchartsDirective,
  NgxEchartsModule,
  provideEcharts,
} from 'ngx-echarts';
import AppComponent from './app.component';
import LazyLoadImageDirective from './shared/directives/lazy-load-image.directive';
import { AuthGuard } from './guards/auth.guard';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    HttpClient,
    HttpClientModule,
    provideHttpClient(),
    provideEcharts(),
    LazyLoadImageDirective,
    AuthGuard,

    // {
    //   provide: NGX_ECHARTS_CONFIG,
    //   useValue: NgxEchartsModule.forRoot({
    //     echarts: () => import('echarts'),
    //   }),
    // },
    NgxEchartsDirective,
  ],
};
