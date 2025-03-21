import {Routes} from '@angular/router';
import {CustomerIndexComponent} from './customer/customer-index/customer-index.component';
import {CustomerCreateComponent} from './customer/customer-create/customer-create.component';
import {CustomerShowComponent} from './customer/customer-show/customer-show.component';
import {CustomerEditComponent} from './customer/customer-edit/customer-edit.component';
import {ReadingsIndexComponent} from './readings/readings-index/readings-index.component';
import {ReadingCreateComponent} from './readings/readings-create/readings-create.component';
import {ReadingShowComponent} from './readings/readings-show/readings-show.component';
import {ReadingEditComponent} from './readings/reading-edit/readings-edit.component';
import {ProfileShowComponent} from './profile/profile-show/profile-show.component';
import {isAdminGuard} from '../../guards/is-admin.guard';
import {UserIndexComponent} from './users/user-index/user-index.component';
import {UserCreateComponent} from './users/user-create/user-create.component';

export const routes: Routes = [
  {
    path: 'customers',
    component: CustomerIndexComponent,
    canActivate: [isAdminGuard]
  },
  {
    path: 'customers/create',
    component: CustomerCreateComponent,
    canActivate: [isAdminGuard],
  },
  {
    path: 'customers/:id',
    component: CustomerShowComponent,
    canActivate: [isAdminGuard]
  },
  {
    path: 'customers/:id/edit',
    component: CustomerEditComponent,
    canActivate: [isAdminGuard]
  },
  {
    path: 'users',
    component: UserIndexComponent,
    canActivate: [isAdminGuard]
  },
  {
    path: 'users/create',
    component: UserCreateComponent,
    canActivate: [isAdminGuard]
  },
  {
    path: 'readings',
    component: ReadingsIndexComponent
  },
  {
    path: 'readings/create',
    component: ReadingCreateComponent
  },
  {
    path: 'readings/:id',
    component: ReadingShowComponent
  },
  {
    path: 'readings/:id/edit',
    component: ReadingEditComponent
  },
  {
    path: 'profile',
    component: ProfileShowComponent
  }
];
