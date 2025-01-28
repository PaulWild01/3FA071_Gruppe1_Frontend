import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {KindOfMeter} from '../enums/kind-of-meter';
import {NgForOf, NgIf} from '@angular/common';
import {ReadingService} from '../services/reading.service';
import {NgbDateAdapter, NgbDateNativeAdapter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapCalendar3} from '@ng-icons/bootstrap-icons';
import {isDateOrNull} from '../validators/IsDateOrNull';
import {Reading} from '../types/reading';
import { read } from '@popperjs/core';

@Component({
  selector: 'app-readings-edit',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    NgbInputDatepicker,
    NgIcon,
    NgIf
  ],
  providers: [provideIcons({bootstrapCalendar3}), {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}],
  templateUrl: './readings-edit.component.html',
  styleUrl: './readings-edit.component.css'
})
export class ReadingEditComponent {
  readings?: Reading;
  readingform = new FormGroup({
    customerid: new FormControl<string>('', Validators.required),
    DateOfReading: new FormControl<Date | null>(null, isDateOrNull()),
    meterId: new FormControl<string>('', Validators.required),
    meterCount: new FormControl<number>(0, Validators.required),
    kindOfMeter: new FormControl<KindOfMeter>(KindOfMeter.STROM),
    comment: new FormControl<string>('', Validators.required),
    substitute: new FormControl<boolean>(false, Validators.required),
});

  constructor(private readingservice: ReadingService, private route: ActivatedRoute, private router: Router) {
    this.readingservice.findById(this.route.snapshot.params['id'])
      .subscribe(reading => {
        this.readings = reading

        const birthdate: Date | null = reading.dateOfReading ? new Date(reading.dateOfReading) : null;

        this.customerId?.setValue(reading.customer.id);
        this.dateOfReading?.setValue(birthdate);
        this.meterId?.setValue(reading.meterId);
        this.meterCount?.setValue(reading.meterCount)
        this.kindOfMeter?.setValue(reading.kindOfMeter);
        this.comment?.setValue(reading.comment);
        this.substitute?.setValue(reading.substitute);


        this.dateOfReading?.updateValueAndValidity();
      });
  }

  public kindOfMeterMethod(): string[] {
    return Object.keys(KindOfMeter);
  }

  public submit() {
    if (this.readingform.invalid) {
      this.readingform.markAllAsTouched();
      return;
    }

    const date = this.readingform.value.DateOfReading as Date | undefined;

    this.readingservice.update(
      this.readings?.id ?? '',
      this.readingform.value.customerid ?? '',
      date ?? new Date(),
      this.readingform.value.meterId ?? '',
      this.readingform.value.meterCount ?? 0,
      this.readingform.value.kindOfMeter ?? KindOfMeter.STROM,
      this.readingform.value.comment ?? '',
      this.readingform.value.substitute ?? false,
    ).subscribe(string => this.router.navigate(['/readings', this.readings?.id ?? '']));
  }

  get customerId() {
    return this.readingform.get('customerid') as FormControl<string>;
  }

  get dateOfReading() {
    return (this.readingform.get('DateOfReading') as FormControl<Date | null>) || null;
  }

  get meterId() {
    return this.readingform.get('meterId')
  }

  get meterCount() {
    return this.readingform.get('meterCount')
  }

  get kindOfMeter() {
    return this.readingform.get('kindOfMeter')
  }

  get comment() {
    return this.readingform.get('comment')
  }

  get substitute() {
    return this.readingform.get('substitute')
  }
}
