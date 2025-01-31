import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Customer} from '../../types/customer';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Import File</h4>
      </div>
      <div class="mb-4 modal-body">
        <label for="formFile" class="form-label">Accepted Format: JSON, XML or CSV</label>
        <input class="form-control" type="file" id="formFile" (change)="onFileSelected($event)">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">{{ cancelButtonText }}</button>
        <button type="button" class="btn btn-danger" (click)="okButtonClicked()">{{ okButtonText }}</button>
      </div>
  `,
})
export class ImportModalComponent {
  modal = inject(NgbActiveModal);
  @Input() cancelButtonText = "Cancel";
  @Input() okButtonText = "Ok";
  @Input() okButtonClosure: (data: Customer[]) => void = () => {};
  selectedFile: File | null = null;
  filedata: Customer[] = [];

  okButtonClicked() {
    if (this.filedata.length > 0) {
      this.okButtonClosure(this.filedata);
      this.modal.close('Ok click')
    }
    else {
      alert("Invalid file format.");
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        try {
          this.filedata = JSON.parse(content);
          console.log("Success" + this.filedata);
        }
        catch (err) {
          console.log(err);
        }
      };
      reader.readAsText(file);
    }
  }
}
