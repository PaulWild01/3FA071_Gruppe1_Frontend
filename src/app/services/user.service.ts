import {Injectable} from '@angular/core';
import {User} from '../types/user';
import {ApiRessourceService} from './api-ressource.service';
import {UserData} from '../types/user.data';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiRessourceService<User, UserData> {
  override path = 'users';
}
