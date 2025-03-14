import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-guest',
  imports: [
    RouterOutlet,
    NgIcon,
    NgbTooltip,
  ],
  templateUrl: './guest.component.html'
})
export class GuestComponent {
  private themeService = inject(ThemeService);

  toggleDarkmode() {
    this.themeService.toggleDarkmode();
  }
}
