import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lesson {
  id: number;
  teacherId: number;
  subjectId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classRoom: string;
  isActive: boolean;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:8080/api/lesson-schedules';
  private subjectUrl = 'http://localhost:8080/api/subjects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }

  create(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, lesson);
  }

  update(id: number, lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/${id}`, lesson);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.subjectUrl);
  }

  getTeachersBySubject(subjectId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.subjectUrl}/${subjectId}/teachers`);
  }

  getTeachersBySubjectFull(subjectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.subjectUrl}/${subjectId}/teachers`);
  }
}
