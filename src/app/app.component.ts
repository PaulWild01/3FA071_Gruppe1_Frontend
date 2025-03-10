import {Component, computed, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    NgbTooltip,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  protected readonly document = document;

  theme = signal<'light' | 'dark'>('light');
  tooltip = computed(() => `Switch to ${this.theme() === 'light' ? 'dark' : 'light'} mode`)

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
