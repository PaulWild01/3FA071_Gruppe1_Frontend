import {Component, inject, signal} from '@angular/core';
import {InputComponent} from '../../../../components/input/input.component';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-profile-show',
  imports: [
    InputComponent
  ],
  templateUrl: './profile-show.component.html',
})
export class ProfileShowComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  user = this.authService.user$.value!;
  profileForm = new FormGroup({
    id: new FormControl({value: this.user.id ?? '', disabled: true}),
    username: new FormControl({value: this.user.username ?? '', disabled: true}),
    role: new FormControl({value: this.user.role ?? '', disabled: true}),
  });

  customer = this.user.customer;
  customerForm = new FormGroup({
    id: new FormControl({value: this.customer?.id ?? '', disabled: true}),
    firstName: new FormControl({value: this.customer?.firstName ?? '', disabled: true}),
    lastName: new FormControl({value: this.customer?.lastName ?? '', disabled: true}),
    gender: new FormControl({value: this.customer?.gender ?? '', disabled: true}),
    birthdate: new FormControl({value: this.customer?.birthDate ?? '', disabled: true}),
  });

  passwordForm = new FormGroup({
    password: new FormControl(''),
    passwordConfirmation: new FormControl(''),
  })

  mode = signal<'show' | 'changeUsername' | 'changePassword'>('show');

  delete() {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = 'Delete Account';
    modal.componentInstance.body = 'Are you sure you want to delete this account?';
    modal.componentInstance.okButtonText = 'Yes';
    modal.componentInstance.okButtonClosure = () => {
      this.userService.destroy(this.authService.user$.value?.id!).subscribe(() => {
        this.router.navigate(['/login']).then();
      });
    };
  }

  editUsername() {
    this.mode.set('changeUsername');
    this.profileForm.controls.username.enable();
  }

  submitNewUsername() {

  }

  editPassword() {
    this.mode.set('changePassword');
  }

  submitNewPassword() {

  }

  cancel() {
    this.mode.set('show');
    this.profileForm.controls.username.disable();
  }
}
