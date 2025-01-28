import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">{{ title }}</h4>
      <button
        type="button"
        class="btn-close"
        (click)="modal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      {{ body }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">{{ cancelButtonText }}</button>
      <button type="button" class="btn btn-danger" (click)="okButtonClicked()">{{ okButtonText }}</button>
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
