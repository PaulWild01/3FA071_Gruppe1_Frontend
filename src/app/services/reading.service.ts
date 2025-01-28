import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reading} from '../types/reading';
import { KindOfMeter } from '../enums/kind-of-meter';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
  private url = "http://localhost:8080/readings";

  constructor(private http: HttpClient) {
  }

  public all(): Observable<Reading[]> {
    return this.http.get<Reading[]>(this.url);
  }

  public findById(id: string): Observable<Reading> {
    return this.http.get<Reading>(`${this.url}/${id}`);
  }

    public store(customer: string, dateOfReading: string, meterId: string, meterCount: string, kindOfMeter: string, comment: string, substitute?: string,): Observable<Reading> {
      return this.http.post<Reading>(this.url, {customer, dateOfReading, meterId, meterCount, kindOfMeter, comment, substitute});
    }

    public update(id: string, customerId: string, dateOfReading: Date, meterId: string, meterCount: number, kindOfMeter: KindOfMeter, comment: string, substitute?: boolean): Observable<string> {
      const formattedDateOfReading: string | undefined = dateOfReading?.toISOString().substring(0, 10);
  
      return this.http.put<string>(this.url,
        {
          id,
          customerId,
          dateOfReading: formattedDateOfReading,
          meterId,
          meterCount,
          kindOfMeter,
          comment,
          substitute
        });
    }
}
