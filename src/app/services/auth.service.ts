import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);
    private http = inject(HttpClient);

    loggedIn$ = new BehaviorSubject<boolean | undefined>(undefined);
    authData = '';

    login(username: string, password: string, control: FormControl) {
        this.authData = window.btoa(username + ':' + password);
        this.http.get('http://localhost:8080/authenticate').subscribe({
            next: () => {
                this.loggedIn$.next(true);
                window.localStorage.setItem('authData', this.authData);
                this.router.navigate(['customers']).then();
            },
            error: () => control.setErrors({'incorrectCredentials': true}),
        });
    }

    logout() {
        this.loggedIn$.next(false);
        window.localStorage.removeItem('authData');
        this.router.navigate(['login']).then();
    }

    checkAuthStatus() {
        return this.http.get('http://localhost:8080/authenticate').pipe(
            tap({
                next: () => this.loggedIn$.next(true),
                error: () => this.loggedIn$.next(false),
            })
        )
    }

    constructor() {
        this.authData = window.localStorage.getItem('authData') ?? '';
    }
}
