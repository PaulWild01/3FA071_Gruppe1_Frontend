import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {map, of} from 'rxjs';
import {User} from '../types/user';
import {Gender} from '../enums/gender';

const admin: User = {id: '49ebadf8-b64e-4b7d-8d98-000180558d7e', username: 'Admin', role: 'admin'};
const customer: User = {id: '49ebadf8-b64e-4b7d-8d98-000180558d7f', username: 'Customer', role: 'customer', customer: {id: '49ebadf8-b64e-4b7d-8d98-000180558d7d', gender: Gender.M, firstName: 'Siegmund', lastName: 'Schneider', birthDate: undefined}};

export const mockRoleInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url === 'http://localhost:8080/users' && req.method === 'GET') {
    return of(new HttpResponse({body: [admin, customer]}));
  }

  if (req.url === 'http://localhost:8080/users/49ebadf8-b64e-4b7d-8d98-000180558d7e' && req.method === 'GET') {
    return of(new HttpResponse({body: admin}));
  }

  if (req.url === 'http://localhost:8080/users/49ebadf8-b64e-4b7d-8d98-000180558d7f' && req.method === 'GET') {
    return of(new HttpResponse({body: customer}));
  }

  if (req.url === 'http://localhost:8080/users/authenticate') {
    return next(req).pipe(
      map((data: any) => {
        if (data.body) {
          data.body = admin;
        }
        return data;
      })
    );
  }

  return next(req);
};
