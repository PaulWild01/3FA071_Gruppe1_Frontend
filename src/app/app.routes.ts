import {Routes} from '@angular/router';
import {routes as authRoutes} from './pages/auth/auth.routes';
import {routes as guestRoutes} from './pages/guest/guest.routes';
import {AuthComponent} from './pages/auth/auth.component';
import {GuestComponent} from './pages/guest/guest.component';
import {isLoggedInGuard} from './guards/is-logged-in.guard';
import {isNotLoggedInGuard} from './guards/is-not-logged-in.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: authRoutes,
    canActivate: [isLoggedInGuard],
  },
  {
    path: '',
    component: GuestComponent,
    children: guestRoutes,
    canActivate: [isNotLoggedInGuard],
  }
];
