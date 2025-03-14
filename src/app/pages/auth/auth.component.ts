import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
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
    RouterLinkActive
  ],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  isMenuCollapsed = true;

  toggleDarkmode() {
    this.themeService.toggleDarkmode();
    this.isMenuCollapsed = true;
  }

  logout() {
    this.authService.logout();
  }
}
