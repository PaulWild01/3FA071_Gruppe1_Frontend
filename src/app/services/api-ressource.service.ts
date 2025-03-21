import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRessourceService<T, D> {
  private http = inject(HttpClient);
  private readonly URL = 'http://localhost:8080';
  protected path = '';

  all(): Observable<T[]> {
    return this.http.get<T[]>(`${this.URL}/${this.path}`);
  }

  findById(id: string): Observable<T> {
    return this.http.get<T>(`${this.URL}/${this.path}/${id}`);
  }

  store(data: D): Observable<T> {
    return this.http.post<T>(`${this.URL}/${this.path}`, data);
  }

  update(data: D): Observable<string> {
    return this.http.put<string>(`${this.URL}/${this.path}`, data);
  }

  destroy(id: string): Observable<string> {
    return this.http.delete<string>(`${this.URL}/${this.path}/${id}`);
  }
}
