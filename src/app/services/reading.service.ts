import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reading} from '../types/reading';

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
}
