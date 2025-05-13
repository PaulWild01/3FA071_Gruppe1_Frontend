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
      <button type="button" class="btn btn-outline-danger"
              (click)="modal.dismiss('cancel click')">{{ cancelButtonText }}
      </button>
      <button type="button" class="btn btn-success" (click)="okButtonClicked()">{{ okButtonText }}</button>
    </div>
  `,
})
export class ImportModalCustomerComponent {
  modal = inject(NgbActiveModal);
  @Input() cancelButtonText = "Cancel";
  @Input() okButtonText = "Ok";
  @Input({ required: true }) okButtonClosure!: (data: Customer[]) => void;
  selectedFile: File | null = null;
  fileContent: string | null = null;
  filedata: Customer[] = [];

  okButtonClicked() {
    if (this.fileContent && this.selectedFile) {
      if (this.selectedFile.name.endsWith(".json")) {
        this.parseJSON(this.fileContent);
      } else if (this.selectedFile.name.endsWith(".xml")) {
        this.parseXML(this.fileContent);
      } else if (this.selectedFile.name.endsWith(".csv")) {
        this.parseCSV(this.fileContent);
      }
      if (this.filedata.length > 0) {
        this.okButtonClosure(this.filedata);
        this.modal.close('Ok click')
      } else {
        alert("Invalid file format.");
      }
    } else {
      alert("Please select a file")
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result as string;
      };
      reader.readAsText(this.selectedFile);
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
    } catch (error) {
      console.error('Fehler beim Parsen der XML-Datei:', error);
      alert('Invalid XML file');
    }
  }

  parseCSV(content: string): void {
    try {
      const lines = content.split("\n");
      const headers = lines[0].split(",");
      this.filedata = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length === headers.length) {
          const record: Record<string, string> = {};
          for (let j = 0; j < headers.length; j++) {
            record[headers[j].trim()] = values[j].trim();
          }

          this.filedata.push({
            id: record["id"],
            firstName: record['firstName'],
            lastName: record['lastName'],
            gender: this.toGender(record['gender']),
            birthDate: record['birthDate'] || undefined,
          });
        }
      }
    } catch (err) {
      console.error('Fehler beim Parsen der CSV-Datei:', err);
      alert('Invalid CSV file');
    }
  }

  private toGender(value: string): Gender {
    if (Object.values(Gender).includes(value as Gender)) {
      return value as Gender;
    }
    throw new Error(`Ungültiger Gender-Wert: ${value}`);
  }
}
