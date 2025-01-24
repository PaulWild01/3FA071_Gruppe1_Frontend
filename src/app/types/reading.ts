import {Customer} from './customer';
import {KindOfMeter} from '../enums/kind-of-meter';

export interface Reading {
  id: string,
  customer: Customer,
  dateOfReading: Date,
  meterId: string,
  meterCount: number,
  metertype: KindOfMeter,
  comment: string,
  substitute: boolean,
}
