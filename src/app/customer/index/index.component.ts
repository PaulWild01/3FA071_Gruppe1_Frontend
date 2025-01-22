import {Component, inject} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../types/customer';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  customerService: CustomerService = inject(CustomerService)
  customers: Customer[] = [];

  constructor() {
    this.customerService.all().subscribe((customers: Customer[]) => {
      this.customers = customers;
    });
  }
}
