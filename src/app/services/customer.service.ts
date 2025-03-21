import {Injectable} from '@angular/core';
import {Customer} from '../types/customer';
import {ApiRessourceService} from './api-ressource.service';
import {CustomerData} from '../types/customer.data';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends ApiRessourceService<Customer, CustomerData> {
  override path = 'customers'
}
