import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {Column} from '../../../../types/column';
import {User} from '../../../../types/user';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {CustomButtonComponent} from '../../../../components/custom-button/custom-button.component';
import {ConfigureColumnModal} from '../../../../components/confirmation-modal/configure-column-modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-index',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIcon,
    CustomButtonComponent
  ],
  templateUrl: './user-index.component.html',
  styles: `
    tr.customer {
      cursor: pointer;
    }
  `
})
export class UserIndexComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  users: User[] = [];
  columns: Column<User>[] = [
    {
      name: "id",
      displayName: "ID",
      getValue: user => user.id,
      show: false,
      canSort: false,
    },
    {
      name: "username",
      displayName: "Username",
      getValue: user => user.username,
      show: true,
      canSort: true,
    },
    {
      name: "role",
      displayName: "Role",
      getValue: user => user.role,
      show: true,
      canSort: true,
    },
    {
      name: "customerId",
      displayName: "Customer ID",
      getValue: user => user.customer ? user.customer.id : '',
      show: false,
      canSort: false,
    },
    {
      name: "customerName",
      displayName: "Customer Name",
      getValue: user => user.customer ? `${user.customer.firstName} ${user.customer.lastName}` : '',
      show: true,
      canSort: false,
    },
  ];
  orderBy?: string;
  orderDirection?: string;
  query?: string;
  showFilters = false;
  roleFilter?: 'Admin' | 'Customer';

  applyFilters(): void {
    this.updateQueryParams();
    this.loadUsers();
  }

  clearFilters(): void {
    this.query = undefined;
    this.roleFilter = undefined;
    this.updateQueryParams();
    this.loadUsers();
  }

  changeOrderBy(orderBy: string): void {
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
    this.loadUsers();
    this.updateQueryParams();
  }

  private loadUsers() {
    this.userService.all()
      .subscribe(users => {
        this.users = users
          .filter(user => this.filterUser(user))
          .sort((a, b) => this.sortUser(a, b));
      });
  }

  private filterUser(user: User): boolean {
    return ((!this.query || this.searchQuery(user)) && (!this.roleFilter || user.role === this.roleFilter))
  }

  private searchQuery(user: User): boolean {
    return user.id.includes(this.query ?? '') ||
      user.username.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      user.role.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      `${user.customer?.firstName.toLowerCase()} ${user.customer?.lastName.toLowerCase()}`.includes(this.query?.toLowerCase() ?? '');
  }

  private updateQueryParams(): void {
    if (this.roleFilter?.toUpperCase() === 'UNDEFINED') {
      this.roleFilter = undefined;
    }

    if (this.query === '') {
      this.query = undefined;
    }
    const query = this.query ? this.query : null;

    const role = this.roleFilter ? this.roleFilter : null;

    const orderBy = this.orderBy ? this.orderBy : null;

    const desc = this.orderDirection === 'desc' ? true : null;

    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: {q: query, role: role, orderBy: orderBy, desc: desc},
        queryParamsHandling: 'merge'
      }
    ).then();

  }

  private sortUser(a: User, b: User): number {
    if (!this.orderBy) return 0;

    const orderBy: string = this.orderBy ?? '';
    const value: number = this.orderDirection === 'desc' ? 1 : -1;

    return (a[orderBy as keyof User] ?? '') > (b[orderBy as keyof User] ?? '') ? -value : value;
  }

  showConfigureColumnsModal() {
    const modal = this.modalService.open(ConfigureColumnModal);
    modal.componentInstance.columns = this.columns;
    modal.componentInstance.okButtonClosure((columns: Column<User>[]) => this.columns = columns);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') ?? '';

      this.orderBy = params.get('orderBy') ?? '';
      this.orderDirection = params.get('desc') === 'true' ? 'desc' : 'asc';

      this.loadUsers();
    });

    if (this.query) {
      this.showFilters = true;
    }
  }

  navigateToUser(id: string) {
    this.router.navigate(['/users', id]).then();
  }
}
