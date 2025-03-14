import {Routes} from '@angular/router';
import {routes as authRoutes} from './pages/auth/auth.routes';
import {routes as guestRoutes} from './pages/guest/guest.routes';
import {AuthComponent} from './pages/auth/auth.component';
import {GuestComponent} from './pages/guest/guest.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: authRoutes,
  },
  {
    path: 'auth',
    component: GuestComponent,
    children: guestRoutes,
  }
];
