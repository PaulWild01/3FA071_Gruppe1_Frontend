import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../../enums/gender';
import {CustomerService} from '../../../../services/customer.service';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {isDateOrNull} from '../../../../validators/IsDateOrNull';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {InputComponent} from '../../../../components/input/input.component';
import {SelectComponent} from '../../../../components/select/select.component';
import {DatePickerComponent} from '../../../../components/date-picker/date-picker.component';

@Component({
  selector: 'app-customer-create',
  imports: [
    ReactiveFormsModule,
    CustomButtonComponent,
    InputComponent,
    SelectComponent,
    DatePickerComponent,
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
  ],
  templateUrl: './customer-create.component.html',
})
export class CustomerCreateComponent {
  customerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl(Gender.U),
    birthdate: new FormControl<Date | null>(null, isDateOrNull()),
  });

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

    const date = this.customerForm.value.birthdate as Date | undefined;

    this.customerService.store(
      this.customerForm.value.firstName ?? '',
      this.customerForm.value.lastName ?? '',
      this.customerForm.value.gender ?? '',
      date,
    ).subscribe(customer => this.router.navigate(['/customers', customer.id]));
  }

  constructor(
    private customerService: CustomerService,
    private router: Router) {
  }
}
