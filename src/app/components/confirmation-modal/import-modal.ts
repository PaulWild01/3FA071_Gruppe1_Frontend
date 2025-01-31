import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Customer} from '../../types/customer';
import {Gender} from '../../enums/gender';

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
        if (file.name.endsWith(".json")) {
          this.parseJSON(content);
        }
        else if (file.name.endsWith(".xml")) {
          this.parseXML(content);
        }
      };
      reader.readAsText(file);
    }
  }

  parseJSON(content: string): void {
    try {
      this.filedata = JSON.parse(content);
    } catch (err) {
      console.error('Fehler beim Parsen der JSON-Datei:', err);
      alert('Invalid JSON file');
    }
  }

  parseXML(content: string): void {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const customers = xmlDoc.getElementsByTagName("customer");
      this.filedata = [];

      for (const customer of Array.from(customers)) {
        const id = customer.getElementsByTagName('id')[0]?.textContent || '';
        const firstName = customer.getElementsByTagName('firstName')[0]?.textContent || '';
        const lastName = customer.getElementsByTagName('lastName')[0]?.textContent || '';
        const gender = this.toGender(customer.getElementsByTagName('gender')[0]?.textContent || '');
        const birthDate = customer.getElementsByTagName('birthDate')[0]?.textContent || undefined;

        this.filedata.push({id, firstName, lastName, gender, birthDate})
      }
    }
    catch (error) {
      console.error('Fehler beim Parsen der XML-Datei:', error);
      alert('Invalid XML file');
    }
  }

  private toGender(value: string): Gender {
    if (Object.values(Gender).includes(value as Gender)) {
      return value as Gender;
    }
    throw new Error(`Ungültiger Gender-Wert: ${value}`);
  }
}
