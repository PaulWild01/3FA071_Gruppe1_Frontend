import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = signal<'light' | 'dark'>('light');

  toggleDarkmode() {
    this.theme.update(oldTheme => oldTheme === 'dark' ? 'light': 'dark');
    document.querySelector('html')!.setAttribute('data-bs-theme', this.theme());
    window.localStorage.setItem('theme', this.theme());
  }

  constructor() {
    this.theme.set(window.localStorage.getItem('theme') as 'dark' | 'light' ?? 'light');
    document.querySelector('html')!.setAttribute('data-bs-theme', this.theme());
  }
}
