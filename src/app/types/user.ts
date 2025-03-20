import {Customer} from './customer';

export interface User {
  id: string,
  username: string,
  role: 'admin' | 'customer',
  customer?: Customer,
}
