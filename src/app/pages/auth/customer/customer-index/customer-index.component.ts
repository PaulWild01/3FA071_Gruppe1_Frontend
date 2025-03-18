import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../../../services/customer.service';
import {Customer} from '../../../../types/customer';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Gender} from '../../../../enums/gender';
import {NgIcon} from '@ng-icons/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Column} from "../../../../types/column";
import {ExportModalCustomerComponent} from "../../../../components/confirmation-modal/export-modal-customer";
import {ImportModalCustomerComponent} from "../../../../components/confirmation-modal/import-modal-customer";
import {ConfigureColumnModal} from "../../../../components/confirmation-modal/configure-column-modal";

@Component({
    selector: 'app-customer-index',
    imports: [
        NgForOf,
        CustomButtonComponent,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        NgIcon
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
    public orderBy?: string;
    public orderDirection?: string;

    public genders(): string[] {
        return Object.keys(Gender);
    }

    public columns: Column<Customer>[] = [
        {
            name: "id",
            displayName: "ID",
            getValue: customer => customer.id,
            show: false,
            canSort: false,
        },
        {
            name: "firstName",
            displayName: "First Name",
            getValue: customer => customer.firstName,
            show: true,
            canSort: true,
        },
        {
            name: "lastName",
            displayName: "Last Name",
            getValue: customer => customer.lastName,
            show: true,
            canSort: true,
        },
        {
            name: "gender",
            displayName: "Gender",
            getValue: customer => customer.gender,
            show: true,
            canSort: true,
        },
        {
            name: "birthDate",
            displayName: "Birthdate",
            getValue: customer => customer.birthDate ?? '',
            show: true,
            canSort: true,
        },
    ];

    private updateQueryParams(): void {
        if (this.genderFilter?.toUpperCase() === 'UNDEFINED') {
            this.genderFilter = undefined;
        }
        const gender = this.genderFilter ? this.genderFilter!.toUpperCase() : null;

        if (this.query === '') {
            this.query = undefined;
        }
        const query = this.query ? this.query : null;

        const orderBy = this.orderBy ? this.orderBy : null;

        const desc = this.orderDirection === 'desc' ? true : null;

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: {q: query, gender: gender, orderBy: orderBy, desc: desc},
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

    public changeOrderBy(orderBy: string): void {
        if (this.orderBy === orderBy) {
            if (!this.orderDirection) {
                this.setOrderBy(this.orderBy, 'desc')
                return;
            }

            if (this.orderDirection === 'desc') {
                this.setOrderBy(this.orderBy, 'asc')
                return;
            }

            this.setOrderBy(undefined, undefined);
            return;
        }

        this.setOrderBy(orderBy, 'desc');
    }

    private setOrderBy(orderBy?: string, orderDirection?: string) {
        this.orderBy = orderBy;
        this.orderDirection = orderDirection;
        this.loadCustomers();
        this.updateQueryParams();
    }

    ngOnInit() {
        this.query = this.route.snapshot.queryParams['q'];

        const gender: string | undefined = this.route.snapshot.queryParams['gender'];
        this.genderFilter = gender ? Gender[gender.toUpperCase() as keyof typeof Gender] : undefined;

        this.orderBy = this.route.snapshot.queryParams['orderBy'];
        this.orderDirection = this.route.snapshot.queryParams['desc'] === 'true' ? 'desc' : 'asc';

        this.loadCustomers();

        if (this.query || this.genderFilter) {
            this.showFilters = true;
        }
    }

    private loadCustomers() {
        this.customerService.all()
            .subscribe(customers => {
                this.customers = customers
                    .filter(customer => this.filterCustomer(customer))
                    .sort((a, b) => this.sortCustomer(a, b));
            });
    }

    public showConfigureColumnsModal() {
        const modal = this.modalService.open(ConfigureColumnModal);
        modal.componentInstance.columns = this.columns;
        modal.componentInstance.okButtonClosure((columns: Column<Customer>[]) => this.columns = columns);
    }

    private filterCustomer(customer: Customer): boolean {
        return (!this.genderFilter || customer.gender === this.genderFilter) && (!this.query || this.searchQuery(customer))
    }

    private sortCustomer(a: Customer, b: Customer): number {
        if (!this.orderBy) return 0;

        const orderBy: string = this.orderBy ?? '';
        const value: number = this.orderDirection === 'desc' ? 1 : -1;

        if (this.orderBy === 'birthdate') {
            if (!a.birthDate && !b.birthDate) {
                return 0;
            }

            if (!a.birthDate) {
                return 1;
            }

            if (!b.birthDate) {
                return -1;
            }

            const aBirthdate = new Date(a.birthDate ?? '');
            const bBirthdate = new Date(b.birthDate ?? '');
            return aBirthdate > bBirthdate ? -value : value;
        }

        return (a[orderBy as keyof Customer] ?? '') > (b[orderBy as keyof Customer] ?? '') ? -value : value;
    }

    private searchQuery(customer: Customer): boolean {
        return customer.id.includes(this.query ?? '') ||
            customer.firstName.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
            customer.lastName.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
            `${customer.firstName.toLowerCase()}${customer.lastName.toLowerCase()}`.includes(this.query?.replace(' ', '').toLowerCase() ?? '') ||
            (customer.birthDate?.includes(this.query ?? '') ?? false);
    }

    public storeImport() {
        const modal = this.modalService.open(ImportModalCustomerComponent);
        modal.componentInstance.okButtonClosure = (data: Customer[]) => {
            this.processData(data);
        };
    }

    private processData(data: Customer[]) {
        data.forEach((record, index) => {
            const birthDate = record.birthDate ? new Date(record.birthDate) : undefined;
            this.customerService.store(record.firstName, record.lastName, record.gender, birthDate).subscribe({
                next: () => {
                    if (index === data.length - 1) {
                        this.router.navigate(['/customers']).then();
                    }
                },
                error: (error) => {
                    console.error(error);
                },
            });
        });
    }

    public openExportMenu() {
        const modalRef = this.modalService.open(ExportModalCustomerComponent);
        modalRef.componentInstance.customers = this.customers;
    }

    constructor(
        private customerService: CustomerService,
        public router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal
    ) {
    }
}
