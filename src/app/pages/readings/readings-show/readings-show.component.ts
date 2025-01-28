import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Reading} from '../../../types/reading';
import {ReadingService} from '../../../services/reading.service';

@Component({
  selector: 'app-readings-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './readings-show.component.html',
})
export class ReadingShowComponent {
  readings?: Reading;

  constructor(private readingService: ReadingService, private route: ActivatedRoute) {
    this.readingService.findById(this.route.snapshot.params['id'])
      .subscribe(readings => this.readings = readings);
  }
}
