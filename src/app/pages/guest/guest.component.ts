import {Component, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-guest',
  imports: [
    RouterOutlet,
    NgIcon,
    NgbTooltip,
    RouterLink
  ],
  templateUrl: './guest.component.html'
})
export class GuestComponent {
  theme = signal<'light' | 'dark'>('light');

  toggleDarkmode() {
    const html = document.querySelector('html')!;
    this.theme.update(oldTheme => oldTheme === 'dark' ? 'light': 'dark');

    html.setAttribute('data-bs-theme', this.theme());
    window.localStorage.setItem('theme', this.theme());
  }

  constructor() {
    this.theme.set(window.localStorage.getItem('theme') as 'dark' | 'light' ?? 'light');
    document.querySelector('html')!.setAttribute('data-bs-theme', this.theme());
  }
}
