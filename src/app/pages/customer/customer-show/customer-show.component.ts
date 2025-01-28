import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../types/customer';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../components/confirmation-modal/confirmation-modal.component';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-customer-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent
  ],
  templateUrl: './customer-show.component.html',
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
