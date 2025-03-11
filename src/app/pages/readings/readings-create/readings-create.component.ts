import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ReadingService} from '../../../services/reading.service';
import {KindOfMeter} from '../../../enums/kind-of-meter';
import {ComboBoxComponent} from '../../../components/combo-box/combo-box.component';
import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../types/customer';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {NgIcon} from '@ng-icons/core';
import {NgbDateAdapter, NgbDateNativeAdapter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {isDate} from '../../../validators/IsDate';

@Component({
  selector: 'app-readings-create',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    ComboBoxComponent,
    CustomButtonComponent,
    NgIf,
    NgIcon,
    NgbInputDatepicker
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

  public customers: Customer[] = [];

  public kindOfMeter(): string[] {
    return Object.keys(KindOfMeter);
  }

  ngOnInit() {
    this.customerService.all().subscribe(customers => this.customers = customers);
  }

  public submit() {
    if (this.readingForm.invalid) {
      this.readingForm.markAllAsTouched();
      return;
    }

    const dateOfReading = this.readingForm.controls.dateOfReading.value as Date;

    this.readingService.store(
      this.readingForm.value.customer ?? '',
      dateOfReading,
      this.readingForm.value.meterId ?? '',
      this.readingForm.value.meterCount ?? '',
      this.readingForm.value.kindOfMeter ?? '',
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

  constructor(
    private readingService: ReadingService,
    private customerService: CustomerService,
    private router: Router
  ) {
  }
}
