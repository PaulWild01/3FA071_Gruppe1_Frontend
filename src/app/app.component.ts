import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    NgbTooltip,
    NgbCollapse,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isMenuCollapsed = true;

  protected readonly document = document;

  theme = signal<'light' | 'dark'>('light');

  toggleDarkmode() {
    const html = document.querySelector('html')!;
    this.theme.update(oldTheme => oldTheme === 'dark' ? 'light' : 'dark');

    html.setAttribute('data-bs-theme', this.theme());
    window.localStorage.setItem('theme', this.theme());
    this.isMenuCollapsed = true;
  }

  constructor() {
    this.theme.set(window.localStorage.getItem('theme') as 'dark' | 'light' ?? 'light');
    document.querySelector('html')!.setAttribute('data-bs-theme', this.theme());
  }
}

