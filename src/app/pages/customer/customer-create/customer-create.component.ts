import {Component} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../enums/gender';
import {CustomerService} from '../../../services/customer.service';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {isDateOrNull} from '../../../validators/IsDateOrNull';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {InputComponent} from '../../../components/input/input.component';
import {SelectComponent} from '../../../components/select/select.component';
import {DatePickerComponent} from '../../../components/date-picker/date-picker.component';

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

  genders(): { value: string, label: string }[] {
    let result: { value: string, label: string }[] = [];

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

      if (this.snapshot.queryParams['returnToCreateReading']) {
        commands = ['readings', 'create'];
        queryParams = {
          customer: customer.id,
          dateOfReading: this.snapshot.queryParams['dateOfReading'],
          meterId: this.snapshot.queryParams['meterId'],
          meterCount: this.snapshot.queryParams['meterCount'],
          kindOfMeter: this.snapshot.queryParams['kindOfMeter'],
          comment: this.snapshot.queryParams['comment'],
          substitute: this.snapshot.queryParams['substitute'],
        };
      }

      this.router.navigate(commands, {queryParams}).then();
    });
  }


  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.snapshot = this.activatedRoute.snapshot;
  }
}
