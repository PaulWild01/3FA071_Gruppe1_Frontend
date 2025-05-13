import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {KindOfMeter} from '../../enums/kind-of-meter';
import {Customer} from '../../types/customer';

interface ReadingRecord {
  id: string;
  customer: Customer;
  dateOfReading?: string | null;
  meterId: string;
  meterCount: number;
  kindOfMeter: KindOfMeter;
  comment: string;
  substitute: boolean;
}

@Component({
  selector: 'app-export-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Export Customers with current filters</h4>
    </div>
    <div class="modal-body d-flex gap-3">
      <button type="button" class="btn btn-primary flex-grow-1" (click)="exportAsJson()">JSON</button>
      <button type="button" class="btn btn-secondary flex-grow-1" (click)="exportAsXML()">XML</button>
      <button type="button" class="btn btn-success flex-grow-1" (click)="exportAsCSV()">CSV</button>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-danger" (click)="modal.dismiss('cancel click')">Cancel</button>
    </div>
  `,
})

export class ExportModalReadingComponent {
  modal = inject(NgbActiveModal);
  @Input() readings: ReadingRecord[] = [];

  exportAsJson() {
    const jsonData = JSON.stringify(this.readings, null, 2);
    this.downloadFile(jsonData, 'application/json', 'reading.json');
    this.modal.close('Export click');
  }

  exportAsXML() {
    let xml = '<readings>\n';
    for (const readings of this.readings) {
      xml += '  <reading>\n';
      xml += `    <id>${readings.id}</id>\n`;
      xml += '    <customer>\n';
      xml += `      <id>${readings.customer.id}</id>\n`;
      xml += `      <gender>${readings.customer.gender}</gender>\n`;
      xml += `      <firstName>${readings.customer.firstName}</firstName>\n`;
      xml += `      <lastName>${readings.customer.lastName}</lastName>\n`;
      xml += `      <birthDate>${readings.customer.birthDate}</birthDate>\n`;
      xml += '    </customer>\n';
      xml += `    <dateOfReading>${readings.dateOfReading || ''}</dateOfReading>\n`;
      xml += `    <meterId>${readings.meterId}</meterId>\n`;
      xml += `    <meterCount>${readings.meterCount}</meterCount>\n`;
      xml += `    <kindOfMeter>${readings.kindOfMeter}</kindOfMeter>\n`;
      xml += `    <comment>${readings.comment}</comment>\n`;
      xml += `    <substitute>${readings.substitute}</substitute>\n`;
      xml += '  </reading>\n';
    }
    xml += '</readings>';
    this.downloadFile(xml, 'application/xml', 'readings.xml')
  }

  exportAsCSV() {
    const headers: string[] = ['id', 'customerId', "customerGender", "customerFirstname", "customerLastname", "customerBirthdate", 'dateOfReading', 'meterId', 'meterCount', 'kindOfMeter', 'comment', 'substitute'];
    const rows = this.readings.map((reading) =>
      [
        reading.id,
        reading.customer.id,
        reading.customer.gender,
        reading.customer.firstName,
        reading.customer.lastName,
        reading.customer.gender,
        reading.dateOfReading !== undefined && reading.dateOfReading !== null ? reading.dateOfReading.toString() : '00.00.0000',
        reading.meterId,
        reading.meterCount,
        reading.kindOfMeter,
        reading.comment,
        reading.substitute,
      ]
        .map(value => `"${value.toString().replace(/"/g, '""')}"`)
        .join(',')
    );
    const data = [headers.join(','), ...rows].join('\n');
    this.downloadFile(data, 'application/csv', 'reading.csv');
  }

  private downloadFile(data: string, type: string, filename: string) {
    const blob = new Blob([data], {type: type});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
