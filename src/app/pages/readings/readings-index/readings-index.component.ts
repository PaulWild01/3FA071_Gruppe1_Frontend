import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {ReadingService} from '../../../services/reading.service';
import {Reading} from '../../../types/reading';

@Component({
  selector: 'app-customer-show',
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './readings-index.component.html',
})
export class ReadingsIndexComponent {
  public readings: Reading[] = [];

  constructor(private readingService: ReadingService) {
    readingService.all().subscribe(readings => this.readings = readings)
  }
}
