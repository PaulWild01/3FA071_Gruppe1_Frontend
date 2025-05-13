import {Component, computed, effect, input, signal} from '@angular/core';
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
    @if (label()) {
      <label [for]="name()" class="form-label">{{ label() }}</label>
    }
    <div class="dropdown">
      <div class="input-group">
        <input [name]="name()" [id]="name()" [(ngModel)]="searchQuery" type="text" class="form-control"
               [disabled]="selectedItem() !== undefined" (focusin)="inputFocused.set(true)"
               (keyup.escape)="inputFocused.set(false)">
        @if (selectedItem()) {
          <app-custom-button (click)="onReset()" color="danger" icon="x-circle"/>
        }
        <ng-content/>
      </div>

      <input hidden type="text" [formControl]="control()">

      @if (showDropdown()) {
        <ul class="dropdown-menu show">
          @for (item of suggestedItems(); track item.value) {
            <button type="button" ngbDropdownItem (click)="onSelect(item)">{{ item.label }}</button>
          }
        </ul>
      }
    </div>
    @if (control().invalid && control().touched) {
      <span class="small text-danger">Required</span>
    }
  `,
})
export class ComboBoxComponent {
  name = input.required<string>();
  label = input<string>();
  items = input.required<any[]>();
  filter = input.required<(items: any[], value: string) => Item[]>();
  control = input.required<FormControl>();
  selectedItem = signal<Item | undefined>(undefined);
  searchQuery = signal('');
  inputFocused = signal(false);

  preSelectedItem = input<Item>();

  constructor() {
    effect(() => {
      if (this.preSelectedItem()) {
        this.onSelect(this.preSelectedItem()!);
      }
    });
  }

  showDropdown = computed(() => {
    return this.selectedItem() === undefined && this.suggestedItems().length > 0 && this.inputFocused() && this.searchQuery().length > 0;
  });

  suggestedItems = computed<Item[]>(() => {
    return this.filter()(this.items(), this.searchQuery().toLowerCase());
  })

  onSelect(item: Item) {
    this.selectedItem.set(item);
    this.searchQuery.set(item.label);
    this.inputFocused.set(false);
    this.control().setValue(item.value);
  }

  onReset() {
    this.selectedItem.set(undefined);
    this.searchQuery.set('');
    this.control().setValue('');
  }
}
