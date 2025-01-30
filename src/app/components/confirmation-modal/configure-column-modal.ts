import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForOf} from '@angular/common';
import {Column} from '../../types/column';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-confirmation-modal',
  imports: [
    NgForOf,
    FormsModule
  ],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Configure Columns</h4>
      <button
        type="button"
        class="btn-close"
        (click)="modal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <div *ngFor="let column of columns; index as i" class="form-check">
        <input [(ngModel)]="columns[i].show" (ngModelChange)="this.columns[i] = column" [checked]="column.show" class="form-check-input" type="checkbox" [id]="column.name">
        <label (change)="column.show = !column.show" class="form-check-label" [for]="column.name">
          {{ column.displayName ?? column.name }}
        </label>

      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="okButtonClicked()">Ok</button>
    </div>
  `,
})
export class ConfigureColumnModal {
  modal = inject(NgbActiveModal);
  @Input() columns: Column[] = [];
  @Input() okButtonClosure: (columns: Column[]) => void = () => {};

  okButtonClicked() {
    this.okButtonClosure(this.columns);
    this.modal.close('Ok click')
  }
}
