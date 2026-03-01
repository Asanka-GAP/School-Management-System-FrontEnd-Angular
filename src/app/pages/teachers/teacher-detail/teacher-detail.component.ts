import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher, TeacherService } from '../../../services/teacher.service';
import { Subject, SubjectService } from '../../../services/subject.service';
import { HttpClient } from '@angular/common/http';

declare var $: any;

interface LessonSchedule {
  id: number;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classRoom: string;
  isActive: boolean;
}

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-detail.component.html',
  styleUrl: './teacher-detail.component.scss'
})
export class TeacherDetailComponent implements OnInit {
  teacher: Teacher | null = null;
  subjects: Subject[] = [];
  lessons: LessonSchedule[] = [];
  loading = true;
  weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  hours = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];
  scheduleView: 'week' | 'day' = 'week';
  selectedDay = 'MONDAY';
  stats = {
    attendance: 0,
    subjects: 0,
    lessons: 0,
    classes: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTeacher(id);
    this.loadSubjects();
    this.loadLessons(id);
  }


  loadTeacher(id: number): void {
    this.teacherService.getById(id).subscribe({
      next: (data) => {
        this.teacher = data;
        this.stats.subjects = data.subjectIds?.length || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/teachers']);
      }
    });
  }

  loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => this.subjects = data
    });
  }

  loadLessons(teacherId: number): void {
    this.http.get<LessonSchedule[]>(`http://localhost:8080/api/lesson-schedules/teacher/${teacherId}`).subscribe({
      next: (data) => {
        this.lessons = data;
        this.stats.lessons = data.length;
        this.stats.classes = new Set(data.map(l => l.classRoom)).size;
      },
      error: (err) => console.error('Error loading lessons:', err)
    });
    
    this.http.get<number>(`http://localhost:8080/api/teacher-attendance/teacher/${teacherId}/percentage`).subscribe({
      next: (percentage) => {
        this.stats.attendance = Math.round(percentage);
      },
      error: () => {
        this.stats.attendance = 0;
      }
    });
  }

  getSubjectName(id: number): string {
    return this.subjects.find(s => s.id === id)?.name || '';
  }

  goBack(): void {
    this.router.navigate(['/teachers']);
  }

  getLessonsForDay(day: string): LessonSchedule[] {
    return this.lessons.filter(l => l.dayOfWeek === day);
  }

  getTopPosition(startTime: string): number {
    const [hour, min] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + min;
    const startMinutes = 7 * 60 + 30; // 7:30 AM
    return totalMinutes - startMinutes;
  }

  getHeight(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes - startMinutes;
  }
}
