import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../services/auth.service";
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet,
    NgIcon,
    NgbTooltip,
    RouterLink,
    NgbCollapse,
    RouterLinkActive,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem
  ],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  isMenuCollapsed = true;
  username = signal<string>('');

  isAdmin() {
    return this.authService.user$.value?.role === 'Admin';
  }

  constructor() {
    this.authService.user$.subscribe(user => this.username.set(user?.username ?? ''));
  }

  toggleDarkmode() {
    this.themeService.toggleDarkmode();
    this.isMenuCollapsed = true;
  }

  logout() {
    this.authService.logout();
  }
}
