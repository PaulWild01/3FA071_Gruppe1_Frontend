import {Injectable} from '@angular/core';
import {Customer} from '../types/customer';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private url = "http://localhost:8080/customers";

  constructor(private http: HttpClient) {
  }

  public all(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }

  public findById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  public store(firstName: string, lastName: string, gender: string, birthDate?: Date): Observable<Customer> {
    const formattedBirthdate: string | undefined = birthDate?.toISOString().substring(0, 10);

    return this.http.post<Customer>(this.url,
      {
        firstName,
        lastName,
        gender,
        birthDate: formattedBirthdate,
      });
  }

  public update(id: string, firstName: string, lastName: string, gender: string, birthDate?: Date): Observable<string> {
    const formattedBirthdate: string | undefined = birthDate?.toISOString().substring(0, 10);

    return this.http.put<string>(this.url,
      {
        id,
        firstName,
        lastName,
        gender,
        birthDate: formattedBirthdate,
      });
  }
}
