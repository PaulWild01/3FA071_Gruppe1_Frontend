import {Component} from '@angular/core';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../types/customer';
import {NgForOf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {NgIcon, provideIcons, provideNgIconsConfig} from '@ng-icons/core';
import {bootstrapTrash, bootstrapPencil, bootstrapEye} from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-customer-index',
  imports: [
    NgIcon,
    NgForOf,
    RouterLink
  ],
  providers: [
    provideIcons({bootstrapTrash, bootstrapPencil, bootstrapEye}),
    provideNgIconsConfig({size: '1.25rem'}),
  ],
  templateUrl: './customer-index.component.html',
  styleUrl: './customer-index.component.css'
})
export class CustomerIndexComponent {
  public customers: Customer[] = [];

  public delete(customer: Customer) {
    this.customerService.destroy(customer.id).subscribe(data => this.router.navigate(['/customers']));
  }

  constructor(private customerService: CustomerService, private router: Router) {
    customerService.all().subscribe(customers => this.customers = customers)
  }
}
