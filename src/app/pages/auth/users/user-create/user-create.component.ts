import {Component, inject} from '@angular/core';
import {CustomButtonComponent} from "../../../../components/custom-button/custom-button.component";
import {InputComponent} from "../../../../components/input/input.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectComponent} from "../../../../components/select/select.component";
import {ComboBoxComponent} from '../../../../components/combo-box/combo-box.component';
import {Customer} from '../../../../types/customer';
import {CustomerService} from '../../../../services/customer.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-user-create',
  imports: [
    CustomButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    SelectComponent,
    ComboBoxComponent
  ],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent {
  userService = inject(UserService);
  customerService = inject(CustomerService);
  customers: Customer[] = [];
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    role: new FormControl('Customer', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirmation: new FormControl('', Validators.required),
    customer: new FormControl('', Validators.required),
  });

  filter(items: Customer[], value: string): { label: string, value: string }[] {
    return items.filter(customer => {
      return customer.firstName.toLowerCase().includes(value) ||
        customer.lastName.toLowerCase().includes(value) ||
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(value);
    }).map(customer => {
      return {label: `${customer.firstName} ${customer.lastName}`, value: customer.id};
    }).slice(0, 5);
  }

  submit() {
    if (this.userForm.controls.username.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService.store({
      username: this.userForm.controls.username.value ?? '',
      role: (this.userForm.controls.role.value ?? 'Customer') as 'Customer' | 'Admin',
      password: this.userForm.controls.password.value ?? '',
      passwordConfirmation: this.userForm.controls.passwordConfirmation.value ?? '',
      customerId: this.userForm.controls.customer.value ?? '',
    });
  }

  resetCustomer() {
    this.userForm.controls.customer.setValue('');
  }

  constructor() {
    this.customerService.all().subscribe(customers => this.customers = customers);
  }
}
