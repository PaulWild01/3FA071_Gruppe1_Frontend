import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {User} from "../types/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);
    private http = inject(HttpClient);

    readonly user$ = new BehaviorSubject<User | undefined>(undefined);
    loggedIn$ = new BehaviorSubject<boolean | undefined>(undefined);
    authData = '';

    login(username: string, password: string, control: FormControl) {
        this.authData = window.btoa(username + ':' + password);
        this.http.get<User>('http://localhost:8080/users/authenticate').subscribe({
            next: user => {
                this.user$.next(user);
                this.loggedIn$.next(true);
                window.localStorage.setItem('authData', this.authData);
                this.router.navigate(['customers']).then();
            },
            error: () => control.setErrors({'incorrectCredentials': true}),
        });
    }

    logout() {
        window.localStorage.removeItem('authData');
        this.loggedIn$.next(false);
        this.user$.next(undefined);
        this.router.navigate(['login']).then();
    }

    checkAuthStatus() {
        return this.http.get<User>('http://localhost:8080/users/authenticate').pipe(
            tap({
                next: user => {
                    this.user$.next(user);
                    this.loggedIn$.next(true);
                },
                error: () => {
                    this.user$.next(undefined);
                    this.loggedIn$.next(false);
                },
            })
        )
    }

    constructor() {
        this.authData = window.localStorage.getItem('authData') ?? '';
    }
}
