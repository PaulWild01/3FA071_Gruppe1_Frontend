import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet,
    NgIcon,
    NgbTooltip,
    RouterLink,
    NgbCollapse,
    RouterLinkActive
  ],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  theme = signal<'light' | 'dark'>('light');
  isMenuCollapsed = true;

  toggleDarkmode() {
    const html = document.querySelector('html')!;
    this.theme.update(oldTheme => oldTheme === 'dark' ? 'light': 'dark');

    html.setAttribute('data-bs-theme', this.theme());
    window.localStorage.setItem('theme', this.theme());
    this.isMenuCollapsed = true;
  }

  constructor() {
    this.theme.set(window.localStorage.getItem('theme') as 'dark' | 'light' ?? 'light');
    document.querySelector('html')!.setAttribute('data-bs-theme', this.theme());
  }
}
