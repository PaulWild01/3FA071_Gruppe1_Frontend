import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../../enums/gender';
import {CustomerService} from '../../../../services/customer.service';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {isDateOrNull} from '../../../../validators/IsDateOrNull';
import {Customer} from '../../../../types/customer';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {InputComponent} from '../../../../components/input/input.component';
import {SelectComponent} from '../../../../components/select/select.component';
import {DatePickerComponent} from '../../../../components/date-picker/date-picker.component';

@Component({
  selector: 'app-customer-edit',
  imports: [
    ReactiveFormsModule,
    CustomButtonComponent,
    InputComponent,
    SelectComponent,
    DatePickerComponent
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
  ],
  templateUrl: './customer-edit.component.html',
})
export class CustomerEditComponent {
  customer?: Customer;
  customerForm = new FormGroup({
    id: new FormControl({value: '', disabled: true}),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    gender: new FormControl<Gender>(Gender.U),
    birthdate: new FormControl<Date | null>(null, isDateOrNull()),
  });

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) {
    this.customerService.findById(this.route.snapshot.params['id'])
      .subscribe(customer => {
        this.customer = customer

        const birthdate: Date | null = customer.birthDate ? new Date(customer.birthDate) : null;

        this.customerForm.controls.id?.setValue(customer.id);
        this.customerForm.controls.firstName?.setValue(customer.firstName);
        this.customerForm.controls.lastName?.setValue(customer.lastName);
        this.customerForm.controls.gender?.setValue(customer.gender);
        this.customerForm.controls.birthdate?.setValue(birthdate);

        this.customerForm.controls.birthdate?.updateValueAndValidity();
      });
  }

  genders(): {value: string, label: string}[] {
    let result: {value: string, label: string}[] = [];

    Object.keys(Gender).forEach(key => result.push({value: key, label: ''}));
    Object.values(Gender).forEach((value, index) => result[index].label = value);

    return result;
  }

  public submit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.customerService.update({
      id: this.customerForm.controls.id.value ?? '',
      firstName: this.customerForm.value.firstName ?? '',
      lastName: this.customerForm.value.lastName ?? '',
      gender: this.customerForm.value.gender ?? Gender.U,
      birthDate: this.customerForm.value.birthdate?.toISOString().slice(0, 10) ?? '',
    }).subscribe(() => this.router.navigate(['/customers', this.customer?.id ?? '']));
  }
}
