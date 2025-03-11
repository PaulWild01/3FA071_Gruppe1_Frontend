import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../enums/gender';
import {NgForOf, NgIf} from '@angular/common';
import {CustomerService} from '../../../services/customer.service';
import {NgbDateAdapter, NgbDateNativeAdapter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {NgIcon} from '@ng-icons/core';
import {isDateOrNull} from '../../../validators/IsDateOrNull';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-customer-create',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIcon,
    NgIf,
    NgbInputDatepicker,
    CustomButtonComponent,
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
  ],
  templateUrl: './customer-create.component.html',
})
export class CustomerCreateComponent {
  customerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl(Gender.U),
    birthdate: new FormControl<Date | null>(null, isDateOrNull()),
  });

  public genders(): string[] {
    return Object.keys(Gender);
  }

  public submit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const date = this.customerForm.value.birthdate as Date | undefined;

    this.customerService.store(
      this.customerForm.value.firstName ?? '',
      this.customerForm.value.lastName ?? '',
      this.customerForm.value.gender ?? '',
      date,
    ).subscribe(customer => this.router.navigate(['/customers', customer.id]));
  }

  get firstName() {
    return this.customerForm.get('firstName')
  }

  get lastName() {
    return this.customerForm.get('lastName')
  }

  get birthdate() {
    return this.customerForm.get('birthdate')
  }

  constructor(
    private customerService: CustomerService,
    private router: Router) {
  }
}
