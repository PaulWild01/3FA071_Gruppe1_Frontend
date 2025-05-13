import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">{{ title }}</h4>
    </div>
    <div class="modal-body">
      {{ body }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-danger" (click)="modal.dismiss('cancel click')">{{ cancelButtonText }}</button>
      <button type="button" class="btn btn-success" (click)="okButtonClicked()">{{ okButtonText }}</button>
    </div>
  `,
})
export class ConfirmationModalComponent {
  modal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() body!: string;
  @Input() cancelButtonText = "Cancel";
  @Input() okButtonText = "Ok";
  @Input() okButtonClosure: () => void = () => {};

  okButtonClicked() {
    this.okButtonClosure();
    this.modal.close('Ok click')
  }
}
