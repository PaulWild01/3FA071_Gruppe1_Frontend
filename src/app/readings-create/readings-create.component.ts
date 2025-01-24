import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ReadingService} from '../services/reading.service';
import { KindOfMeter } from '../enums/kind-of-meter';

@Component({
  selector: 'app-readings-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './readings-create.component.html',
  styleUrl: './readings-create.component.css'
})
export class ReadingCreateComponent {
  readingform = new FormGroup({
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
    this.readingservice.store(
      this.readingform.value.customer ?? '',
      this.readingform.value.dateOfReading ?? '',
      this.readingform.value.meterId ?? '',
      this.readingform.value.meterCount ?? '',
      this.readingform.value.KindOfMeter ?? '',
      this.readingform.value.Comment ?? '',
      this.readingform.value.substitute ?? '',
    ).subscribe(reading => this.router.navigate(['reading', reading.id]));
  }

  constructor(private readingservice: ReadingService, private router: Router) {
  }
}
