export interface UserData {
  id?: string;
  username?: string;
  role?: 'Customer' | 'Admin';
  password?: string,
  passwordConfirmation?: string,
  customerId?: string;
}
