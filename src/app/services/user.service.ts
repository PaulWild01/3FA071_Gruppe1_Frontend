import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:8080/users";

  constructor(private http: HttpClient) {
  }

  public all(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  public destroy(id: string): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
