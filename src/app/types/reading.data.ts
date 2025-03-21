import {Customer} from './customer';
import {KindOfMeter} from '../enums/kind-of-meter';

export interface ReadingData {
  id?: string,
  customer?: Customer,
  dateOfReading?: string,
  meterId?: string,
  meterCount?: number,
  kindOfMeter?: KindOfMeter,
  comment?: string,
  substitute?: boolean,
}
