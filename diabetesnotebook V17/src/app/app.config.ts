import { ApplicationConfig, importProvidersFrom } from '@angular/core';
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

import LazyLoadImageDirective from './shared/directives/lazy-load-image.directive';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    HttpClientModule,
    provideHttpClient(),
    provideEcharts(),
    LazyLoadImageDirective,
  ],
};
