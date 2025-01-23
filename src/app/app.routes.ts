import {Routes} from '@angular/router';
import {CustomerIndexComponent} from './customer-index/customer-index.component';
import {CustomerCreateComponent} from './customer-create/customer-create.component';
import {CustomerShowComponent} from './customer-show/customer-show.component';

export const routes: Routes = [
  {
    path: 'customers',
    component: CustomerIndexComponent
  },
  {
    path: 'customers/create',
    component: CustomerCreateComponent
  },
  {
    path: 'customers/:id',
    component: CustomerShowComponent
  },
  {
    path: 'customers/:id/edit',
    component: CustomerShowComponent
  },
];
