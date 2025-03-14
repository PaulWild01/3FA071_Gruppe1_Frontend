import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Reading} from '../../../../types/reading';
import {ReadingService} from '../../../../services/reading.service';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {Customer} from '../../../../types/customer';
import {InputComponent} from '../../../../components/input/input.component';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-readings-show',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    InputComponent,
  ],
  templateUrl: './readings-show.component.html',
})
export class ReadingShowComponent {
  reading?: Reading;
  customer?: Customer;

  readingForm = new FormGroup({
    id: new FormControl<string>({value: '', disabled: true}),
    customer: new FormControl<string>({value: '', disabled: true}),
    dateOfReading: new FormControl<string>({value: '', disabled: true}),
    meterId: new FormControl<string>({value: '', disabled: true}),
    meterCount: new FormControl<number>({value: 0, disabled: true}),
    kindOfMeter: new FormControl<string>({value: '', disabled: true}),
    comment: new FormControl<string>({value: '', disabled: true}),
    substitute: new FormControl<string>({value: '', disabled: true}),
  });

  delete() {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.title = 'Delete Reading';
    modal.componentInstance.body = 'Are you sure you want to delete this reading?';
    modal.componentInstance.okButtonText = 'Yes';
    modal.componentInstance.okButtonClosure = () => {
      this.readingService.destroy(this.reading!.id).subscribe(() => this.router.navigate(['/readings']));
    };
  }

  constructor(private readingService: ReadingService, private route: ActivatedRoute, private modalService: NgbModal, private router: Router) {
    this.readingService.findById(this.route.snapshot.params['id'])
      .subscribe(reading => {
        this.reading = reading;
        this.customer = reading.customer;

        const dateOfReading: Date | null = reading.dateOfReading ? new Date(reading.dateOfReading) : null;

        this.readingForm.controls.id?.setValue(reading.id);
        this.readingForm.controls.customer?.setValue(`${reading.customer.firstName} ${reading.customer.lastName}`);
        this.readingForm.controls.dateOfReading?.setValue(dateOfReading?.toISOString().slice(0, 10) ?? '');
        this.readingForm.controls.meterId?.setValue(reading.meterId);
        this.readingForm.controls.meterCount?.setValue(reading.meterCount)
        this.readingForm.controls.kindOfMeter?.setValue(reading.kindOfMeter);
        this.readingForm.controls.comment?.setValue(reading.comment);
        this.readingForm.controls.substitute?.setValue(reading.substitute ? 'True' : 'False');

        this.readingForm.controls.dateOfReading?.updateValueAndValidity();
      });
  }
}
