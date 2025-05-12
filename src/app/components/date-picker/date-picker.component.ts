import {Component, input} from '@angular/core';
import {NgIcon} from '@ng-icons/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [
    NgIcon,
    NgbInputDatepicker,
    ReactiveFormsModule,
  ],
  template: `
    @if (label()) {
      <label [for]="name()" class="form-label">{{ label() }}</label>
    }
    <div class="input-group">
      <input [id]="name()" [name]="name()" class="form-control" [formControl]="control()" ngbDatepicker
             #d="ngbDatepicker" [minDate]="{year: 1900, month:1, day: 1}" [maxDate]="currentDate">
      <button class="btn btn-outline-secondary d-flex align-items-center" (click)="d.toggle()" type="button">
        <ng-icon name="bootstrapCalendar3"></ng-icon>
      </button>
    </div>
    @if (control().invalid && control().touched) {
      <span class="small text-danger">Required</span>
    }
  `
})
export class DatePickerComponent {
  control = input.required<FormControl>();
  name = input.required<string>();
  label = input<string>();
  currentDate: { year: number, month: number, day: number };

  constructor() {
    const today = new Date();
    this.currentDate = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()};
  }
}
