import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reading} from '../types/reading';
import {KindOfMeter} from '../enums/kind-of-meter';
import {CustomerService} from './customer.service';
import {Customer} from '../types/customer';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
  private url = "http://localhost:8080/readings";

  constructor(private http: HttpClient, private customerService: CustomerService) {
  }

  all(): Observable<Reading[]> {
    return this.http.get<Reading[]>(this.url);
  }

  findById(id: string): Observable<Reading> {
    return this.http.get<Reading>(`${this.url}/${id}`);
  }

  store(customer: Customer, dateOfReading: Date, meterId: string, meterCount: number, kindOfMeter: KindOfMeter, comment: string, substitute?: boolean): Observable<Reading> {
    const formattedDateOfReading = dateOfReading.toISOString().substring(0, 10);

    return this.http.post<Reading>(this.url, {
      customer,
      dateOfReading: formattedDateOfReading,
      meterId,
      meterCount,
      kindOfMeter,
      comment,
      substitute
    });
  }

  update(id: string, customer: Customer, dateOfReading: Date, meterId: string, meterCount: number, kindOfMeter: KindOfMeter, comment: string, substitute?: boolean): Observable<string> {
    const formattedDateOfReading: string | undefined = dateOfReading?.toISOString().substring(0, 10);

    return this.http.put<string>(this.url,
      {
        id,
        customer,
        dateOfReading: formattedDateOfReading,
        meterId,
        meterCount,
        kindOfMeter,
        comment,
        substitute
      });
  }

  destroy(id: string): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
