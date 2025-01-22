import {Injectable} from '@angular/core';
import {Customer} from '../types/customer';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private url: string = "http://localhost:8080/customers";

  constructor(private http: HttpClient) {
  }

  public all(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }

  public findById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }
}
