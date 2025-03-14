import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  loggedIn$ = new BehaviorSubject<boolean>(false);

  login(username: string, password: string, control: FormControl) {
    if (username === 'username' && password === 'password') {
      this.loggedIn$.next(true);
      this.router.navigate(['customers']).then();
      window.localStorage.setItem('loggedIn', 'true');
      return;
    }

    control.setErrors({'incorrectCredentials': true})
  }

  logout() {
    this.loggedIn$.next(false);
    window.localStorage.setItem('loggedIn', 'false');
    this.router.navigate(['login']).then();
  }

  constructor() {
    if (window.localStorage.getItem('loggedIn') === 'true') {
      this.loggedIn$.next(true);
    }
  }
}
