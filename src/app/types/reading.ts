import {Customer} from './customer';
import {KindOfMeter} from '../enums/kind-of-meter';

export interface Reading {
  id: string,
  customer: Customer,
  dateOfReading: Date,
  meter_ID: string,
  meterCount: number,
  meter_type: KindOfMeter,
  comment: string,
  substitute: boolean,
}
