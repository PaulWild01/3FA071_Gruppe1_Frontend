import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors, withNoXsrfProtection} from '@angular/common/http';
import {provideIcons, provideNgIconsConfig} from '@ng-icons/core';

import * as boostrapIcons from '@ng-icons/bootstrap-icons'
import {apiInterceptor} from './interceptors/api.interceptor';
import {mockRoleInterceptor} from './interceptors/mock-role.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withNoXsrfProtection(), withInterceptors([apiInterceptor, mockRoleInterceptor])),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideIcons(boostrapIcons),
    provideNgIconsConfig({
      size: '1.5rem',
    }),
  ]
};
