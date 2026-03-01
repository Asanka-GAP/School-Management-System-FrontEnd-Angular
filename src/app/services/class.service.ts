import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SchoolClass {
  id: number;
  className: string;
  grade: number;
  character: string;
  capacity: number;
  supervisorId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:8080/api/classes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(this.apiUrl);
  }

  getById(id: number): Observable<SchoolClass> {
    return this.http.get<SchoolClass>(`${this.apiUrl}/${id}`);
  }

  create(schoolClass: SchoolClass): Observable<SchoolClass> {
    return this.http.post<SchoolClass>(this.apiUrl, schoolClass);
  }

  update(id: number, schoolClass: SchoolClass): Observable<SchoolClass> {
    return this.http.put<SchoolClass>(`${this.apiUrl}/${id}`, schoolClass);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
