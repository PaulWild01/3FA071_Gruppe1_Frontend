import {Gender} from '../enums/gender';

export interface CustomerData {
  id?: string,
  gender?: Gender,
  firstName?: string,
  lastName?: string,
  birthDate?: string,
}
