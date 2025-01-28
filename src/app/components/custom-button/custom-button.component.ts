import {Component, HostBinding, HostListener, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {Router} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-button',
  imports: [
    NgIcon,
    NgIf,
    NgbTooltip
  ],
  template: `
    <span [ngbTooltip]="icon ? label : '' ">
        {{ icon ? '' : label }}
        <span *ngIf="icon" class="d-flex align-items-center justify-content-center">
            <ng-icon [name]="getIconName()"/>
        </span>
    </span>
  `,
  styles: ``
})
export class CustomButtonComponent {
  @Input() label = "";
  @Input() color = "primary";
  @Input() icon?: string;
  @Input() link?: string[];

  @HostBinding('class') get classes(): string {
    return `btn btn-${this.color}`;
  };

  @HostListener('click') click(): void {
    if (this.link) {
      this.router.navigate(this.link).then()
    }
  }

  getIconName(): string|undefined {
    if (!this.icon) {
      return;
    }

    return `bootstrap-${this.icon}`.replace(/-./g, x=>x[1].toUpperCase());
  }

  constructor(private router: Router) {
  }
}
