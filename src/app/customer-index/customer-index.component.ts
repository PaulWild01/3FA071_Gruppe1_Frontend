import { Component } from '@angular/core';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../types/customer';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-customer-index',
  imports: [
    NgForOf
  ],
  templateUrl: './customer-index.component.html',
  styleUrl: './customer-index.component.css'
})
export class CustomerIndexComponent {
  public customers: Customer[] = [];

  constructor(private customerService: CustomerService) {
    customerService.all().subscribe(customers => this.customers = customers)
  }
}
