import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../types/customer';

@Component({
  selector: 'app-customer-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './customer-show.component.html',
  styleUrl: './customer-show.component.css'
})
export class CustomerShowComponent {
  customer?: Customer;

  constructor(private customerService: CustomerService, private route: ActivatedRoute) {
    console.log(this.route.snapshot.params);
    this.customerService.findById(this.route.snapshot.params['id'])
      .subscribe(customer => this.customer = customer);
  }
}
