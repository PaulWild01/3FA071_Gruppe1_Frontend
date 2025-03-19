import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {catchError, throwError} from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const request = req.clone({
    setHeaders: {
      Authorization: `Basic ${authService.authData}`,
    }
  });

  return next(request).pipe(
    catchError(error => {
      if (error.status === 401 || error.status === 0) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
