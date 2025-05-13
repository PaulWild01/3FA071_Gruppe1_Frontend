import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReadingService} from '../../../services/reading.service';
import {KindOfMeter} from '../../../enums/kind-of-meter';
import {ComboBoxComponent} from '../../../components/combo-box/combo-box.component';
import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../types/customer';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerComponent} from '../../../components/date-picker/date-picker.component';
import {InputComponent} from '../../../components/input/input.component';
import {SelectComponent} from '../../../components/select/select.component';
import {isDate} from '../../../validators/IsDate';

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
  customer?: Customer;

  kindOfMeter(): { value: string, label: string }[] {
    const result: { value: string, label: string }[] = [];

    Object.keys(KindOfMeter).forEach(key => result.push({value: key, label: ''}));
    Object.values(KindOfMeter).forEach((value, index) => result[index].label = value);

    return result;
  }

  ngOnInit() {
    this.customerService.all()
      .subscribe(customers => {
        this.customers = customers;

        const customerId = this.activatedRoute.snapshot.queryParams['customer'] ?? '';
        this.readingForm.controls.customer.setValue(customerId);
        this.readingForm.controls.comment.setValue(this.activatedRoute.snapshot.queryParams['comment'] ?? '');
        this.readingForm.controls.meterCount.setValue(this.activatedRoute.snapshot.queryParams['meterCount'] ?? '');
        this.readingForm.controls.meterId.setValue(this.activatedRoute.snapshot.queryParams['meterId'] ?? '');
        this.readingForm.controls.kindOfMeter.setValue(this.activatedRoute.snapshot.queryParams['kindOfMeter'] ?? 'HEIZUNG');
        this.readingForm.controls.substitute.setValue(this.activatedRoute.snapshot.queryParams['substitute'] ?? false);
        this.readingForm.controls.dateOfReading.setValue(new Date(Date.parse(this.activatedRoute.snapshot.queryParams['dateOfReading'])) ?? null);

        this.customer = this.customers.find(customer => customer.id === customerId);
      });

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

    const dateOfReading = this.readingForm.controls.dateOfReading.value as Date;

    this.readingService.store(
      customer,
      dateOfReading,
      this.readingForm.value.meterId ?? '',
      parseFloat(this.readingForm.value.meterCount ?? ''),
      this.toKindOfMeter(this.readingForm.value.kindOfMeter ?? ''),
      this.readingForm.value.comment ?? '',
      this.readingForm.value.substitute ?? false,
    ).subscribe(reading => this.router.navigate(['readings', reading.id]));
  }

  public filter(items: Customer[], value: string): { label: string, value: string }[] {
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

  navigateToCreateCustomer() {
    const dateOfReading = this.readingForm.controls.dateOfReading.valid ? this.readingForm.controls.dateOfReading.value?.toISOString() ?? null : null;
    const meterId = this.readingForm.controls.meterId.value !== '' ? this.readingForm.controls.meterId.value : null;
    const meterCount = this.readingForm.controls.meterCount.value !== '' ? this.readingForm.controls.meterCount.value : null;
    const comment = this.readingForm.controls.comment.value !== '' ? this.readingForm.controls.comment.value : null;

    this.router.navigate(['customers', 'create'], {
      queryParams: {
        returnToCreateReading: true,
        dateOfReading,
        meterId,
        meterCount,
        kindOfMeter: this.readingForm.controls.kindOfMeter.value,
        comment,
        substitute: this.readingForm.controls.substitute.value,
      }
    }).then();
  }

  constructor(
    private readingService: ReadingService,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }
}
