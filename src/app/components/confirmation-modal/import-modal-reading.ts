import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Reading} from '../../types/reading';
import {KindOfMeter} from '../../enums/kind-of-meter';
import {CustomerService} from '../../services/customer.service';
import {firstValueFrom, of, switchMap} from 'rxjs';
import {NgxCsvParser} from 'ngx-csv-parser';
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
export class ImportModalReadingComponent {
  csvParser = inject(NgxCsvParser);
  modal = inject(NgbActiveModal);
  @Input() cancelButtonText = "Cancel";
  @Input() okButtonText = "Ok";
  @Input({required: true}) okButtonClosure!: (data: Reading[]) => void;
  selectedFile: File | null = null;
  fileContent: string | null = null;
  fileData: Reading[] = [];

  async okButtonClicked() {
    if (this.fileContent && this.selectedFile) {
      if (this.selectedFile.name.endsWith(".json")) {
        this.parseJSON(this.fileContent);
      } else if (this.selectedFile.name.endsWith(".xml")) {
        await this.parseXML(this.fileContent);
      } else if (this.selectedFile.name.endsWith(".csv")) {
        this.parseCSV(this.fileContent);
      }

      console.log(this.fileData);

      if (this.fileData.length > 0) {
        this.okButtonClosure(this.fileData);
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
      this.fileData = JSON.parse(content);
    } catch (err) {
      console.error('Fehler beim Parsen der JSON-Datei:', err);
      alert('Invalid JSON file');
    }
  }

  async parseXML(content: string): Promise<void> {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const readings = xmlDoc.getElementsByTagName("reading");
      this.fileData = [];
      const promises: Promise<void>[] = [];

      for (const reading of Array.from(readings)) {
        const id = reading.getElementsByTagName('id')[0]?.textContent || '';
        const customerStr = reading.getElementsByTagName('customer')[0]?.textContent || '';
        const customerId = customerStr.slice(0, 37);
        const dateOfReading = reading.getElementsByTagName('dateOfReading')[0]?.textContent || '';
        const meterId = reading.getElementsByTagName('meterId')[0]?.textContent || '';
        const meterCountStr = reading.getElementsByTagName('meterCount')[0]?.textContent || '';
        const kindOfMeter = this.toKindOfMeter(reading.getElementsByTagName('kindOfMeter')[0]?.textContent || '');
        const comment = reading.getElementsByTagName('comment')[0]?.textContent || '';
        const substituteStr = reading.getElementsByTagName('substitute')[0]?.textContent || '';
        const meterCount = parseFloat(meterCountStr);
        const substitute = substituteStr.toLowerCase() === 'true';
        const promise = firstValueFrom(this.customerService.findById(customerId).pipe(switchMap(customer => {
              return of({
                id,
                customer,
                dateOfReading,
                meterId,
                meterCount,
                kindOfMeter,
                comment,
                substitute
              });
            }),
          )
        ).then(data => {
          if (data) {
            console.log(data);
            this.fileData.push(data);
          }
        });
        promises.push(promise);
      }
      await Promise.all(promises);
    } catch (error) {
      console.error('Fehler beim Parsen der XML-Datei:', error);
      alert('Invalid XML file');
    }
  }

  parseCSV(content: string): void {
    const delimiter = content.includes(',') ? ',' : ';';
    try {

      const data: string[][] = this.csvParser.csvStringToArray(content, delimiter);

      for (const [index, item] of data.entries()) {
        if (index === 0) {
          continue;
        }

        this.fileData.push({
          id: item[0],
          meterCount: Number.parseFloat(item[8]),
          kindOfMeter: this.toKindOfMeter(item[9]),
          dateOfReading: item[6],
          meterId: item[7],
          comment: item[10],
          substitute: item[11] === 'true',
          customer: {
            id: item[1],
            firstName: item[3],
            lastName: item[4],
            birthDate: item[5],
            gender: this.toGender(item[2]),
          }
        });
      }
    } catch (err) {
      console.error('Fehler beim Parsen der CSV-Datei:', err);
      alert('Invalid CSV file');
    }
  }

  // async parseCSV(content: string): Promise<void> {
  //   try {
  //     const lines = content.split("\n");
  //     const headers = lines[0].split(",");
  //     this.fileData = [];
  //
  //     for (let i = 1; i < lines.length; i++) {
  //       const values = lines[i].split(",");
  //       if (values.length === headers.length) {
  //         const record: Record<string, string> = {};
  //         for (let j = 0; j < headers.length; j++) {
  //           record[headers[j].trim()] = values[j].trim();
  //         }
  //         const customerId = record['customerId'];
  //         const customer = await firstValueFrom(this.customerService.findById(customerId));
  //
  //         this.fileData.push({
  //           id: record["id"],
  //           customer: customer,
  //           dateOfReading: record['dateOfReading'] || '',
  //           meterId: record['meterId'],
  //           meterCount: parseFloat(record['meterCount']),
  //           kindOfMeter: this.toKindOfMeter(record['kindOfMeter']),
  //           comment: record['comment'],
  //           substitute: record['substitute'].toLowerCase() === 'true',
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Fehler beim Parsen der CSV-Datei:', err);
  //     alert('Invalid CSV file');
  //   }
  // }

  private toKindOfMeter(value: string): KindOfMeter {
    if (Object.values(KindOfMeter).includes(value as KindOfMeter)) {
      return value as KindOfMeter;
    }
    throw new Error(`Ungültiger Gender-Wert: ${value}`);
  }

  private toGender(value: string): Gender {
    if (Object.values(Gender).includes(value as Gender)) {
      return value as Gender;
    }
    throw new Error(`Ungültiger Gender-Wert: ${value}`);
  }

  constructor(private customerService: CustomerService) {
  }
}
