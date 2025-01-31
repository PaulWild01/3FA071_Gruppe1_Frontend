import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {NgbDateAdapter, NgbDateNativeAdapter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapCalendar3} from '@ng-icons/bootstrap-icons';
import {Reading} from '../../../types/reading';
import {isDateOrNull} from '../../../validators/IsDateOrNull';
import {KindOfMeter} from '../../../enums/kind-of-meter';
import {ReadingService} from '../../../services/reading.service';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-readings-edit',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    NgbInputDatepicker,
    NgIcon,
    NgIf,
    CustomButtonComponent
  ],
  providers: [provideIcons({bootstrapCalendar3}), {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}],
  templateUrl: './readings-edit.component.html',
})
export class ReadingEditComponent {
  reading?: Reading;
  readingForm = new FormGroup({
    customerId: new FormControl<string>('', Validators.required),
    dateOfReading: new FormControl<Date | null>(null, isDateOrNull()),
    meterId: new FormControl<string>('', Validators.required),
    meterCount: new FormControl<number>(0, Validators.required),
    kindOfMeter: new FormControl<KindOfMeter>(KindOfMeter.STROM),
    comment: new FormControl<string>(''),
    substitute: new FormControl<boolean>(false, Validators.required),
  });

  constructor(private readingService: ReadingService, private route: ActivatedRoute, private router: Router) {
    this.readingService.findById(this.route.snapshot.params['id'])
      .subscribe(reading => {
        this.reading = reading

        const dateOfReading: Date | null = reading.dateOfReading ? new Date(reading.dateOfReading) : null;

        this.customerId?.setValue(reading.customer.id);
        this.dateOfReading?.setValue(dateOfReading);
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

    this.readingService.update(
      this.reading?.id ?? '',
      this.readingForm.value.customerId ?? '',
      date ?? new Date(),
      this.readingForm.value.meterId ?? '',
      this.readingForm.value.meterCount ?? 0,
      this.readingForm.value.kindOfMeter ?? KindOfMeter.STROM,
      this.readingForm.value.comment ?? '',
      this.readingForm.value.substitute ?? false,
    ).subscribe(() => this.router.navigate(['/readings', this.reading?.id ?? '']));
  }

  get customerId() {
    return this.readingForm.get('customerId') as FormControl<string>;
  }

  get dateOfReading() {
    return this.readingForm.get('dateOfReading')
  }

  get meterId() {
    return this.readingForm.get('meterId')
  }

  get meterCount() {
    return this.readingForm.get('meterCount')
  }

  get kindOfMeter() {
    return this.readingForm.get('kindOfMeter')
  }

  get comment() {
    return this.readingForm.get('comment')
  }

  get substitute() {
    return this.readingForm.get('substitute')
  }
}
