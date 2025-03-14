import {Component} from '@angular/core';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {InputComponent} from '../../../components/input/input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    CustomButtonComponent,
    InputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {

  }
}
