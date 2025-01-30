import {Routes} from '@angular/router';
import {CustomerIndexComponent} from './pages/customer/customer-index/customer-index.component';
import {CustomerCreateComponent} from './pages/customer/customer-create/customer-create.component';
import {CustomerShowComponent} from './pages/customer/customer-show/customer-show.component';
import {CustomerEditComponent} from './pages/customer/customer-edit/customer-edit.component';
import {ReadingsIndexComponent} from './pages/readings/readings-index/readings-index.component';
import {ReadingCreateComponent} from './pages/readings/readings-create/readings-create.component';
import {ReadingShowComponent} from './pages/readings/readings-show/readings-show.component';
import {ReadingEditComponent} from './pages/readings/reading-edit/readings-edit.component';

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
    component: CustomerEditComponent
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
  }
];
