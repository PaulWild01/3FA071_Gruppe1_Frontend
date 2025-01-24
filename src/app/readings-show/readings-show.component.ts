import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Reading} from '../types/reading';
import {ReadingService} from '../services/reading.service';

@Component({
  selector: 'app-readings-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './readings-show.component.html',
  styleUrl: './readings-show.component.css'
})
export class ReadingShowComponent {
  readings?: Reading;

  constructor(private readingservice: ReadingService, private route: ActivatedRoute) {
    console.log(this.route.snapshot.params);
    this.readingservice.findById(this.route.snapshot.params['id'])
      .subscribe(readings => this.readings = readings);
  }
}
