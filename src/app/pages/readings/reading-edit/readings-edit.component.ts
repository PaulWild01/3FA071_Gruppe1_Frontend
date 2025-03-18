import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {provideIcons} from '@ng-icons/core';
import {bootstrapCalendar3} from '@ng-icons/bootstrap-icons';
import {Reading} from '../../../types/reading';
import {isDateOrNull} from '../../../validators/IsDateOrNull';
import {KindOfMeter} from '../../../enums/kind-of-meter';
import {ReadingService} from '../../../services/reading.service';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {InputComponent} from '../../../components/input/input.component';
import {DatePickerComponent} from '../../../components/date-picker/date-picker.component';
import {SelectComponent} from '../../../components/select/select.component';
import {Customer} from '../../../types/customer';
import {ComboBoxComponent} from '../../../components/combo-box/combo-box.component';
import {CustomerService} from '../../../services/customer.service';

@Component({
  selector: 'app-readings-edit',
  imports: [
    ReactiveFormsModule,
    CustomButtonComponent,
    InputComponent,
    DatePickerComponent,
    SelectComponent,
    ComboBoxComponent
  ],
  providers: [provideIcons({bootstrapCalendar3}), {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}],
  templateUrl: './readings-edit.component.html',
})
export class ReadingEditComponent implements OnInit {
  reading?: Reading;
  readingForm = new FormGroup({
    id: new FormControl<string>({value: '', disabled: true}),
    customer: new FormControl('', Validators.required),
    dateOfReading: new FormControl<Date | null>(null, isDateOrNull),
    meterId: new FormControl<string>('', Validators.required),
    meterCount: new FormControl<number>(0, Validators.required),
    kindOfMeter: new FormControl<KindOfMeter>(KindOfMeter.STROM),
    comment: new FormControl<string>(''),
    substitute: new FormControl<boolean>(false, Validators.required),
  });

  customers: Customer[] = [];

  customer?: Customer;
  customerLabel?: string;

  ngOnInit() {
    this.customerService.all().subscribe(customers => this.customers = customers);
  }

  constructor(private readingService: ReadingService, private customerService: CustomerService, private route: ActivatedRoute, private router: Router) {
    this.readingService.findById(this.route.snapshot.params['id'])
      .subscribe(reading => {
        this.reading = reading
        this.customer = reading.customer;
        this.customerLabel = `${reading.customer.firstName} ${reading.customer.lastName}`;

        const dateOfReading: Date | null = reading.dateOfReading ? new Date(reading.dateOfReading) : null;

        this.readingForm.controls.id?.setValue(reading.id);
        this.readingForm.controls.customer?.setValue(reading.customer.id);
        this.readingForm.controls.dateOfReading?.setValue(dateOfReading);
        this.readingForm.controls.meterId?.setValue(reading.meterId);
        this.readingForm.controls.meterCount?.setValue(reading.meterCount)
        this.readingForm.controls.kindOfMeter?.setValue(reading.kindOfMeter);
        this.readingForm.controls.comment?.setValue(reading.comment);
        this.readingForm.controls.substitute?.setValue(reading.substitute);

        this.readingForm.controls.dateOfReading?.updateValueAndValidity();
      });
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

  kindOfMeter(): { value: string, label: string }[] {
    const result: { value: string, label: string }[] = [];

    Object.keys(KindOfMeter).forEach(key => result.push({value: key, label: ''}));
    Object.values(KindOfMeter).forEach((value, index) => result[index].label = value);

    return result;
  }

  submit() {
    if (this.readingForm.invalid) {
      for (const controlName in this.readingForm.controls) {
        const control = this.readingForm.get(controlName);
        if (control && control.invalid) {
          console.log(`${controlName} ist ungültig.`);
          console.log(`Fehler:`, control.errors);
        }
      }
      this.readingForm.markAllAsTouched();
      return;

    }
    const date = this.readingForm.value.dateOfReading as Date | undefined;

    const customerId = this.readingForm.value.customer;
    const customer = this.customers.find(customer => customer.id === customerId);

    if (!customer) {
      console.error('No Customer');
      return;
    }

    this.readingService.update(
      this.reading?.id ?? '',
      customer,
      date ?? new Date(),
      this.readingForm.value.meterId ?? '',
      this.readingForm.value.meterCount ?? 0,
      this.readingForm.value.kindOfMeter ?? KindOfMeter.STROM,
      this.readingForm.value.comment ?? '',
      this.readingForm.value.substitute ?? false,
    ).subscribe(() => this.router.navigate(['/readings', this.reading?.id ?? '']));
  }
}
