import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../types/customer';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Gender} from '../../../enums/gender';

@Component({
  selector: 'app-customer-index',
  imports: [
    NgForOf,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './customer-index.component.html',
  styles: `
    tr.customer {
      cursor: pointer;
    }
  `
})
export class CustomerIndexComponent implements OnInit {
  public customers: Customer[] = [];
  public showFilters = false;
  public query?: string;
  public genderFilter?: Gender;

  public genders(): string[] {
    return Object.keys(Gender);
  }

  private updateQueryParams(): void {
    if (this.genderFilter?.toUpperCase() === 'UNDEFINED') {
      this.genderFilter = undefined;
    }
    const gender = this.genderFilter ? this.genderFilter!.toUpperCase() : null;

    if (this.query === '') {
      this.query = undefined;
    }
    const query = this.query ? this.query : null;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { q: query, gender: gender },
        queryParamsHandling: 'merge'
      }
    ).then();

  }

  public applyFilters(): void {
    this.updateQueryParams();
    this.loadCustomers();
  }

  public clearFilters(): void {
    this.query = undefined;
    this.genderFilter = undefined;
    this.updateQueryParams();
    this.loadCustomers();
  }

  ngOnInit() {
    this.query = this.route.snapshot.queryParams['q'];

    const gender: string|undefined = this.route.snapshot.queryParams['gender'];
    this.genderFilter = gender ? Gender[gender.toUpperCase() as keyof typeof Gender] : undefined;

    this.loadCustomers();

    if (this.query || this.genderFilter) {
      this.showFilters = true;
    }
  }

  private loadCustomers() {
    this.customerService.all().subscribe(customers => {
      this.customers = customers.filter(customer => {
        return (!this.genderFilter || customer.gender === this.genderFilter) && (!this.query || this.searchQuery(customer));
      });
    });
  }

  private searchQuery(customer: Customer): boolean {
    return customer.id.includes(this.query ?? '') ||
      customer.firstName.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      customer.lastName.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      (customer.birthDate?.includes(this.query ?? '') ?? false);
  }

  constructor(private customerService: CustomerService, public router: Router, private route: ActivatedRoute) {
  }
}
