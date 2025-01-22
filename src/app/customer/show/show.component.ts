import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Customer} from '../../types/customer';
import {CustomerService} from '../../services/customer.service';

@Component({
  selector: 'app-show',
  imports: [],
  templateUrl: './show.component.html',
  styleUrl: './show.component.css'
})
export class ShowComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  customerService: CustomerService = inject(CustomerService)
  customer?: Customer;

  constructor() {
    const id= this.route.snapshot.params["id"] ?? "";
    this.customerService.findById(id).subscribe(customer => this.customer = customer);
  }
}
