import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {Reading} from '../types/reading';
import {KindOfMeter} from '../enums/kind-of-meter';
import {CustomerService} from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
  private url = "http://localhost:8080/readings";

  constructor(private http: HttpClient, private customerService: CustomerService) {
  }

  public all(): Observable<Reading[]> {
    return this.http.get<Reading[]>(this.url);
  }

  public findById(id: string): Observable<Reading> {
    return this.http.get<Reading>(`${this.url}/${id}`);
  }

  public store(customerId: string, dateOfReading: Date, meterId: string, meterCount: string, kindOfMeter: string, comment: string, substitute?: boolean): Observable<Reading> {

    const formattedDateOfReading = dateOfReading.toISOString().substring(0, 10);

    console.log(formattedDateOfReading)

    return this.customerService.findById(customerId).pipe(
      switchMap(customer => {

        return this.http.post<Reading>(this.url, {
          customer,
          dateOfReading: formattedDateOfReading,
          meterId,
          meterCount,
          kindOfMeter,
          comment,
          substitute
        });
      })
    );
  }

  public update(id: string, customerid: string, dateOfReading: Date, meterId: string, meterCount: number, kindOfMeter: KindOfMeter, comment: string, substitute?: boolean): Observable<string> {
    const formattedDateOfReading: string | undefined = dateOfReading?.toISOString().substring(0, 10);

    return this.customerService.findById(customerid).pipe(switchMap(customer => {
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
      })
    );
  }
}
