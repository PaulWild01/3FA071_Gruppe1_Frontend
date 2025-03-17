import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    @if (label()) {
      <label [for]="name()" class="form-label">{{ label() }}</label>
    }
    <select [id]="name()" [name]="name()" [formControl]="control()" class="form-select">
      @for (option of options(); track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
      }
    </select>
  `
})
export class SelectComponent {
  control = input.required<FormControl>();
  name = input.required<string>();
  label = input<string>();
  options = input.required<{value: string, label: string}[]>();
}
