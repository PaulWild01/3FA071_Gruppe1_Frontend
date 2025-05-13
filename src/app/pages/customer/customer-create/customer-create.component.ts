import {Component} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../enums/gender';
import {CustomerService} from '../../../services/customer.service';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {isDateOrNull} from '../../../validators/IsDateOrNull';
import {InputComponent} from '../../../components/input/input.component';
import {SelectComponent} from '../../../components/select/select.component';
import {DatePickerComponent} from '../../../components/date-picker/date-picker.component';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-customer-create',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    DatePickerComponent,
    CustomButtonComponent,
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

  genders(): { value: string, label: string }[] {
    const result: { value: string, label: string }[] = [];

    Object.keys(Gender).forEach(key => result.push({value: key, label: ''}));
    Object.values(Gender).forEach((value, index) => result[index].label = value);

    return result;
  }

  private snapshot: ActivatedRouteSnapshot;

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
    ).subscribe(customer => {
      let commands = ['customers', customer.id];
      let queryParams = {};

      const returnTo = this.snapshot.queryParams['returnTo'];
      if (returnTo) {
        queryParams = {
          customer: customer.id,
          dateOfReading: this.snapshot.queryParams['dateOfReading'],
          meterId: this.snapshot.queryParams['meterId'],
          meterCount: this.snapshot.queryParams['meterCount'],
          kindOfMeter: this.snapshot.queryParams['kindOfMeter'],
          comment: this.snapshot.queryParams['comment'],
          substitute: this.snapshot.queryParams['substitute'],
        };

        commands = returnTo === 'create' ? ['readings', 'create'] : ['readings', returnTo, 'edit'];
      }

      this.router.navigate(commands, {queryParams}).then();
    });
  }

  back() {
    let commands = ['customers'];
    let queryParams = {};

    const returnTo = this.snapshot.queryParams['returnTo'];
    if (returnTo) {
      queryParams = {
        dateOfReading: this.snapshot.queryParams['dateOfReading'],
        meterId: this.snapshot.queryParams['meterId'],
        meterCount: this.snapshot.queryParams['meterCount'],
        kindOfMeter: this.snapshot.queryParams['kindOfMeter'],
        comment: this.snapshot.queryParams['comment'],
        substitute: this.snapshot.queryParams['substitute'],
      };

      commands = returnTo === 'create' ? ['readings', 'create'] : ['readings', returnTo, 'edit'];
    }

    this.router.navigate(commands, {queryParams}).then();
  }

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.snapshot = this.activatedRoute.snapshot;
  }
}
