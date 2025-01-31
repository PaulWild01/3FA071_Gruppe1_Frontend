import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Reading} from '../../../types/reading';
import {ReadingService} from '../../../services/reading.service';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-readings-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CustomButtonComponent
  ],
  templateUrl: './readings-show.component.html',
})
export class ReadingShowComponent {
  reading?: Reading;

  public delete() {

  }

  constructor(private readingService: ReadingService, private route: ActivatedRoute) {
    this.readingService.findById(this.route.snapshot.params['id'])
      .subscribe(readings => this.reading = readings);
  }
}
