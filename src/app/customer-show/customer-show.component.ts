import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../types/customer';
import {NgIcon, provideIcons, provideNgIconsConfig} from '@ng-icons/core';
import {bootstrapPencil, bootstrapTrash} from '@ng-icons/bootstrap-icons';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-customer-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIcon
  ],
  providers: [
    provideIcons({bootstrapTrash, bootstrapPencil}),
    provideNgIconsConfig({size: '1.25rem'}),
  ],
  templateUrl: './customer-show.component.html',
  styleUrl: './customer-show.component.css'
})
export class CustomerShowComponent {
  customer?: Customer;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.customerService.findById(this.route.snapshot.params['id'])
      .subscribe(customer => this.customer = customer);
  }

  delete() {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = 'Delete Customer';
    modal.componentInstance.body = 'Are you sure you want to delete this customer?';
    modal.componentInstance.okButtonText = 'Yes';
    modal.componentInstance.okButtonClosure = () => {
      this.customerService.destroy(this.customer!.id).subscribe(() => {
        this.router.navigate(['/customers']).then();
      });
    };
  }
}
