import {Customer} from './customer';

export interface User {
  id: string,
  username: string,
  role: 'Admin' | 'Customer',
  customer?: Customer,
}
