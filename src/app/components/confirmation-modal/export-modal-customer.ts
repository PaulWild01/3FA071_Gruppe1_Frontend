import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Customer} from '../../types/customer';

interface CustomerRecord {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate?: string | null;
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

export class ExportModalCustomerComponent {
  modal = inject(NgbActiveModal);
  @Input() customers: CustomerRecord[] = [];

  exportAsJson() {
    const jsonData = JSON.stringify(this.customers, null, 2);
    this.downloadFile(jsonData, 'application/json', 'customer.json')
    this.modal.close('Export click');
  }

  exportAsXML() {
      let xml = '<customers>\n';
      for (const customer of this.customers) {
        xml += '  <customer>\n';
        xml += `    <id>${customer.id}</id>\n`;
        xml += `    <firstName>${customer.firstName}</firstName>\n`;
        xml += `    <lastName>${customer.lastName}</lastName>\n`;
        xml += `    <gender>${customer.gender}</gender>\n`;
        xml += `    <birthDate>${customer.birthDate || ''}</birthDate>\n`;
        xml += '  </customer>\n';
      }
      xml += '</customers>';
      this.downloadFile(xml, 'application/xml', 'customer.xml')
  }

  exportAsCSV() {
    const headers: (keyof Customer)[] = ['id', 'firstName', 'lastName', 'gender', 'birthDate'];
    const rows = this.customers.map((customer) =>
      headers
        .map((header) => {
          const value = customer[header as keyof Customer] || '';
          return `"${value.toString().replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const data = [headers.join(','), ...rows].join('\n');
    this.downloadFile(data, 'application/csv', 'customer.csv');
  }

  private downloadFile(data: string, type: string, filename: string) {
    const blob = new Blob([data], { type: type });
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
