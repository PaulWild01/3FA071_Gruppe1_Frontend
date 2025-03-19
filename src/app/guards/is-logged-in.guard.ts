import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const isLoggedInGuard: CanActivateFn = (activatedRouteSnapshot, routerSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.loggedIn$.value !== undefined) {
    if (authService.loggedIn$.value) return true;

    router.navigate(['login']).then();
    return false;
  }

  authService.checkAuthStatus().subscribe({
    next: () => router.navigateByUrl(routerSnapshot.url),
    error: () => router.navigate(['login']),
  });
  return false;
};
