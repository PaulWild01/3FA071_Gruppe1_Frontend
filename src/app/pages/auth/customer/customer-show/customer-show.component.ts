import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../../../services/customer.service';
import {Customer} from '../../../../types/customer';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {InputComponent} from '../../../../components/input/input.component';

@Component({
  selector: 'app-customer-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    InputComponent,
  ],
  templateUrl: './customer-show.component.html',
})
export class CustomerShowComponent {
  customer?: Customer;
  customerForm = new FormGroup({
    id: new FormControl({value: '', disabled: true}),
    firstName: new FormControl({value: '', disabled: true}),
    lastName: new FormControl({value: '', disabled: true}),
    gender: new FormControl({value: '', disabled: true}),
    birthdate: new FormControl({value: '', disabled: true}),
  });

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.customerService.findById(this.route.snapshot.params['id'])
      .subscribe(customer => {
        this.customer = customer;

        const birthdate: Date | null = customer.birthDate ? new Date(customer.birthDate) : null;

        this.customerForm.controls.id.setValue(customer.id);
        this.customerForm.controls.firstName.setValue(customer.firstName);
        this.customerForm.controls.lastName.setValue(customer.lastName);
        this.customerForm.controls.gender.setValue(customer.gender);
        this.customerForm.controls.birthdate.setValue(birthdate?.toISOString().slice(0, 10) ?? '');
      });
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
