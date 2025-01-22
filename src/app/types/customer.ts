import {Gender} from '../enums/gender';

export interface Customer {
  id: string,
  gender: Gender,
  firstName: string,
  lastName: string,
  birthDate?: string,
}
