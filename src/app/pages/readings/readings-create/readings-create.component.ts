import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ReadingService} from '../../../services/reading.service';
import {KindOfMeter} from '../../../enums/kind-of-meter';

@Component({
  selector: 'app-readings-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './readings-create.component.html',
})
export class ReadingCreateComponent {
  readingForm = new FormGroup({
    customer: new FormControl(''),
    dateOfReading: new FormControl(''),
    meterId: new FormControl(''),
    meterCount: new FormControl(''),
    KindOfMeter: new FormControl(''),
    Comment: new FormControl(''),
    substitute: new FormControl(''),
  });

  public kindOfMeter(): string[] {
    return Object.keys(KindOfMeter);
  }

  public submit() {
    this.readingService.store(
      this.readingForm.value.customer ?? '',
      this.readingForm.value.dateOfReading ?? '',
      this.readingForm.value.meterId ?? '',
      this.readingForm.value.meterCount ?? '',
      this.readingForm.value.KindOfMeter ?? '',
      this.readingForm.value.Comment ?? '',
      this.readingForm.value.substitute ?? '',
    ).subscribe(reading => this.router.navigate(['reading', reading.id]));
  }

  constructor(private readingService: ReadingService, private router: Router) {
  }
}
