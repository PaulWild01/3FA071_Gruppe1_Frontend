import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Gender} from '../enums/gender';
import {NgForOf} from '@angular/common';
import {CustomerService} from '../services/customer.service';

@Component({
  selector: 'app-customer-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})
export class CustomerCreateComponent {
  customerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    gender: new FormControl(''),
    birthdate: new FormControl(''),
  });

  public genders(): string[] {
    return Object.keys(Gender);
  }

  public submit() {
    this.customerService.store(
      this.customerForm.value.firstName ?? '',
      this.customerForm.value.lastName ?? '',
      this.customerForm.value.gender ?? '',
      this.customerForm.value.birthdate ?? '',
    ).subscribe(customer => this.router.navigate(['/customers', customer.id]));
  }

  constructor(private customerService: CustomerService, private router: Router) {
  }
}
