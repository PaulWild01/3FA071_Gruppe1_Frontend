import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../enums/gender';
import {NgForOf, NgIf} from '@angular/common';
import {CustomerService} from '../services/customer.service';
import {NgbDateAdapter, NgbDateNativeAdapter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {NgIcon, provideIcons, provideNgIconsConfig} from '@ng-icons/core';
import {bootstrapCalendar3} from '@ng-icons/bootstrap-icons';
import {isDateOrNull} from '../validators/IsDateOrNull';
import {Customer} from '../types/customer';

@Component({
  selector: 'app-customer-edit',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    NgbInputDatepicker,
    NgIcon,
    NgIf
  ],
  providers: [
    provideIcons({bootstrapCalendar3}),
    provideNgIconsConfig({size: '1.25rem'}),
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css'
})
export class CustomerEditComponent {
  customer?: Customer;
  customerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    gender: new FormControl<Gender>(Gender.U),
    birthdate: new FormControl<Date | null>(null, isDateOrNull()),
  });

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) {
    this.customerService.findById(this.route.snapshot.params['id'])
      .subscribe(customer => {
        this.customer = customer

        const birthdate: Date | null = customer.birthDate ? new Date(customer.birthDate) : null;

        this.firstName?.setValue(customer.firstName);
        this.lastName?.setValue(customer.lastName);
        this.gender?.setValue(customer.gender);
        this.birthdate?.setValue(birthdate);


        this.birthdate?.updateValueAndValidity();
      });
  }

  public genders(): string[] {
    return Object.keys(Gender);
  }

  public submit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const date = this.customerForm.value.birthdate as Date | undefined;

    this.customerService.update(
      this.customer?.id ?? '',
      this.customerForm.value.firstName ?? '',
      this.customerForm.value.lastName ?? '',
      this.customerForm.value.gender ?? '',
      date,
    ).subscribe(() => this.router.navigate(['/customers', this.customer?.id ?? '']));
  }

  get firstName() {
    return this.customerForm.get('firstName')
  }

  get lastName() {
    return this.customerForm.get('lastName')
  }

  get gender() {
    return this.customerForm.get('gender')
  }

  get birthdate() {
    return this.customerForm.get('birthdate')
  }
}
