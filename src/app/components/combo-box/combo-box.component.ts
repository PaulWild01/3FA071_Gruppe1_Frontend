import {Component, computed, input, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbDropdownItem} from '@ng-bootstrap/ng-bootstrap';
import {CustomButtonComponent} from '../custom-button/custom-button.component';

interface Item {
  label: string;
  value: string;
}

@Component({
  selector: 'app-combo-box',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownItem,
    CustomButtonComponent,
  ],
  template: `
    <div class="dropdown">
      <div class="input-group">
        <input [name]="name()" [id]="name()" [(ngModel)]="searchQuery" type="text" class="form-control"
               [disabled]="selectedItem() !== undefined" (focusin)="inputFocused.set(true)"
               (keyup.escape)="inputFocused.set(false)">
        @if (selectedItem()) {
          <custom-button (click)="onReset()" color="danger" icon="x-circle"/>
        }
      </div>


      <input hidden type="text" [formControl]="formControl()">

      @if (showDropdown()) {
        <ul class="dropdown-menu show">
          @for (item of suggestedItems(); track item.value) {
            <button type="button" ngbDropdownItem (click)="onSelect(item)">{{ item.label }}</button>
          }
        </ul>
      }
    </div>
  `,
  styles: ``
})
export class ComboBoxComponent {
  name = input.required<string>();
  items = input.required<any[]>();
  filter = input.required<(items: any[], value: string) => Item[]>();
  formControl = input.required<FormControl>();
  selectedItem = signal<Item | undefined>(undefined);
  searchQuery = signal('');
  inputFocused = signal(false);

  showDropdown = computed(() => {
    return this.selectedItem() === undefined && this.suggestedItems().length > 0 && this.inputFocused() && this.searchQuery().length > 0;
  });

  suggestedItems = computed<Item[]>(() => {
    return this.filter()(this.items(), this.searchQuery());
  })

  onSelect(item: Item) {
    this.selectedItem.set(item);
    this.searchQuery.set(item.label);
    this.inputFocused.set(false);
    this.formControl().setValue(item.value);
  }

  onReset() {
    this.selectedItem.set(undefined);
    this.searchQuery.set('');
    this.formControl().setValue('');
  }
}
