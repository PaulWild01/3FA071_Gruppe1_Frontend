import {Routes} from '@angular/router';
import {IndexComponent} from './customer/index/index.component';
import {ShowComponent} from './customer/show/show.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: ':id',
    component: ShowComponent
  }
];
