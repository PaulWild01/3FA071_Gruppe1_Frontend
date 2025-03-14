import {Component, inject} from '@angular/core';
import {InputComponent} from '../../../components/input/input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        InputComponent,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private authService = inject(AuthService);

    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    submit() {
        if (this.loginForm.invalid) return;

        this.authService.login(this.loginForm.controls.username.value ?? '', this.loginForm.controls.password.value ?? '', this.loginForm.controls.password);
    }
}
