import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  constructor() {
    // this.authService.checkAuthStatus();
    // this.activatedRoute.url.subscribe(next => {
    //   console.log(next)
    // });
    // console.log(this.activatedRoute.snapshot);
    // this.authService.loggedIn$.next(true)
  }
}

