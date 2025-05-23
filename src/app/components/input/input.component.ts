import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  template: `
    @if (label()) {
      <label [for]="name" class="form-label">{{ label() }}</label>
    }
    <input [formControl]="control()" [type]="type()" class="form-control" [id]="name" [name]="name">
    @if (control().invalid && control().touched) {
      <span class="small text-danger">Required</span>
    }
  `
})
export class InputComponent {
  control = input.required<FormControl>();
  name = input.required<string>();
  label = input<string>();
  type = input('text');
}
