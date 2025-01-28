import {Component} from '@angular/core';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../types/customer';
import {NgForOf} from '@angular/common';
import {Router} from '@angular/router';
import {CustomButtonComponent} from '../custom-button/custom-button.component';

@Component({
  selector: 'app-customer-index',
  imports: [
    NgForOf,
    CustomButtonComponent
  ],
  templateUrl: './customer-index.component.html',
  styles: `
    tr.customer {
      cursor: pointer;
    }
  `
})
export class CustomerIndexComponent {
  public customers: Customer[] = [];

  public delete(customer: Customer) {
    this.customerService.destroy(customer.id).subscribe(() => this.loadCustomers());
  }

  constructor(private customerService: CustomerService, public router: Router) {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.customerService.all().subscribe(customers => this.customers = customers);
  }
}
