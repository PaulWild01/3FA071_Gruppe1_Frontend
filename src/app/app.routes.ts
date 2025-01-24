import {Routes} from '@angular/router';
import {CustomerIndexComponent} from './customer-index/customer-index.component';
import {CustomerCreateComponent} from './customer-create/customer-create.component';
import {CustomerShowComponent} from './customer-show/customer-show.component';
import { ReadingsIndexComponent } from './readings-index/readings-index.component';
import { ReadingShowComponent } from './readings-show/readings-show.component';
import { ReadingCreateComponent } from './readings-create/readings-create.component';

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
  {
    path: 'readings',
    component: ReadingsIndexComponent
  },
  {
    path: 'readings/:id',
    component: ReadingShowComponent
  },
  {
    path: 'readings/:id/edit',
    component: ReadingShowComponent
  },
  {
    path: 'readings/create',
    component: ReadingCreateComponent
  }
];
