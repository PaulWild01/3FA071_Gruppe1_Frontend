import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {DatePickerComponent} from '../../../../components/date-picker/date-picker.component';
import {Customer} from '../../../../types/customer';
import {KindOfMeter} from '../../../../enums/kind-of-meter';
import {SelectComponent} from '../../../../components/select/select.component';
import {InputComponent} from '../../../../components/input/input.component';
import {ComboBoxComponent} from '../../../../components/combo-box/combo-box.component';
import {ReadingService} from '../../../../services/reading.service';
import {CustomerService} from '../../../../services/customer.service';
import {isDate} from '../../../../validators/IsDate';

@Component({
  selector: 'app-readings-create',
  imports: [
    ReactiveFormsModule,
    ComboBoxComponent,
    CustomButtonComponent,
    DatePickerComponent,
    InputComponent,
    SelectComponent
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
  ],
  templateUrl: './readings-create.component.html',
})
export class ReadingCreateComponent implements OnInit {
  readingForm = new FormGroup({
    customer: new FormControl('', Validators.required),
    dateOfReading: new FormControl<Date | null>(null, isDate),
    meterId: new FormControl('', Validators.required),
    meterCount: new FormControl('', Validators.required),
    kindOfMeter: new FormControl('HEIZUNG'),
    comment: new FormControl(''),
    substitute: new FormControl<boolean>(false),
  });

  customers: Customer[] = [];

  kindOfMeter(): { value: string, label: string }[] {
    const result: { value: string, label: string }[] = [];

    Object.keys(KindOfMeter).forEach(key => result.push({value: key, label: ''}));
    Object.values(KindOfMeter).forEach((value, index) => result[index].label = value);

    return result;
  }

  ngOnInit() {
    this.customerService.all().subscribe(customers => this.customers = customers);
  }

  submit() {
    if (this.readingForm.invalid) {
      this.readingForm.markAllAsTouched();
      return;
    }

    const customerId = this.readingForm.value.customer;
    const customer = this.customers.find(customer => customer.id === customerId);

    if (!customer) {
      console.error('No Customer');
      return;
    }

    this.readingService.store({
      customer,
      dateOfReading: this.readingForm.value.dateOfReading?.toISOString().slice(0, 10),
      meterId: this.readingForm.value.meterId ?? '',
      meterCount: parseFloat(this.readingForm.value.meterCount ?? ''),
      kindOfMeter: (this.readingForm.value.kindOfMeter ?? KindOfMeter.HEIZUNG) as KindOfMeter,
      comment: this.readingForm.value.comment ?? '',
      substitute: this.readingForm.value.substitute ?? false,
    }).subscribe(reading => this.router.navigate(['readings', reading.id]));
  }

  filter(items: Customer[], value: string): { label: string, value: string }[] {
    return items.filter(customer => {
      return customer.firstName.toLowerCase().includes(value) ||
        customer.lastName.toLowerCase().includes(value) ||
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(value);
    }).map(customer => {
      return {label: `${customer.firstName} ${customer.lastName}`, value: customer.id};
    }).slice(0, 5);
  }

  private toKindOfMeter(value: string): KindOfMeter {
    if (Object.values(KindOfMeter).includes(value as KindOfMeter)) {
      return value as KindOfMeter;
    }
    throw new Error(`Ungültiger Gender-Wert: ${value}`);
  }

  constructor(
    private readingService: ReadingService,
    private customerService: CustomerService,
    private router: Router
  ) {
  }
}
