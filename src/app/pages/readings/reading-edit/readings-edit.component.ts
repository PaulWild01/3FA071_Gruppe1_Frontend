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
import {InputComponent} from '../../../components/input/input.component';
import {DatePickerComponent} from '../../../components/date-picker/date-picker.component';
import {SelectComponent} from '../../../components/select/select.component';
import {Customer} from '../../../types/customer';
import {ComboBoxComponent} from '../../../components/combo-box/combo-box.component';
import {CustomerService} from '../../../services/customer.service';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-readings-edit',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    DatePickerComponent,
    SelectComponent,
    ComboBoxComponent,
    CustomButtonComponent
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

        const id: string = this.reading?.id ?? '';
        const customerId: string = this.route.snapshot.queryParams['customer'] ?? this.reading?.customer?.id ?? '';
        const dateOfReading: Date | null = new Date(Date.parse(this.route.snapshot.queryParams['dateOfReading'] ?? reading?.dateOfReading ?? ''));
        const meterId: string = this.route.snapshot.queryParams['meterId'] ?? this.reading?.meterId ?? '';
        const meterCount: number = this.route.snapshot.queryParams['meterCount'] ?? this.reading?.meterCount ?? 0;
        const kindOfMeter: KindOfMeter = this.route.snapshot.queryParams['kindOfMeter'] ?? this.reading?.kindOfMeter ?? 'Heizung';
        const comment: string = this.route.snapshot.queryParams['comment'] ?? this.reading?.comment ?? '';
        const substitute: boolean = this.route.snapshot.queryParams['substitute'] ?? this.reading?.substitute ?? false;

        this.readingForm.controls.id.setValue(id);
        this.readingForm.controls.customer.setValue(customerId);
        this.readingForm.controls.dateOfReading.setValue(dateOfReading);
        this.readingForm.controls.meterId.setValue(meterId);
        this.readingForm.controls.meterCount.setValue(meterCount);
        this.readingForm.controls.kindOfMeter.setValue(kindOfMeter);
        this.readingForm.controls.comment.setValue(comment);
        this.readingForm.controls.substitute.setValue(substitute);

        this.customerService.findById(customerId).subscribe(customer => {
          this.customer = customer;
          this.customerLabel = reading.customer ? `${reading.customer.firstName} ${reading.customer.lastName}` : '';
        });
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

  navigateToCreateCustomer() {
    const dateOfReading = this.readingForm.controls.dateOfReading.valid ? this.readingForm.controls.dateOfReading.value?.toISOString() ?? null : null;
    const meterId = this.readingForm.controls.meterId.value !== '' ? this.readingForm.controls.meterId.value : null;
    const comment = this.readingForm.controls.comment.value !== '' ? this.readingForm.controls.comment.value : null;

    this.router.navigate(['customers', 'create'], {
      queryParams: {
        returnTo: this.reading?.id ?? '',
        dateOfReading,
        meterId,
        meterCount: this.readingForm.controls.meterCount.value,
        kindOfMeter: this.readingForm.controls.kindOfMeter.value,
        comment,
        substitute: this.readingForm.controls.substitute.value,
      }
    }).then();
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
