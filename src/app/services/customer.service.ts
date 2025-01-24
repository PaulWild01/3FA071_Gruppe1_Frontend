import {Injectable} from '@angular/core';
import {Customer} from '../types/customer';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Paginator} from '../types/paginator';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private url = "http://localhost:8080/customers";

  constructor(private http: HttpClient) {
  }

  public all(page: number): Observable<Paginator<Customer>> {
    return this.http.get<Paginator<Customer>>(this.url + "?page=" + page);
  }

  public findById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  public store(firstName: string, lastName: string, gender: string, birthdate?: string): Observable<Customer> {
    return this.http.post<Customer>(this.url, {firstName, lastName, gender, birthdate});
  }
}
