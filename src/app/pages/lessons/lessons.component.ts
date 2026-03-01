import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lesson, LessonService, Subject } from '../../services/lesson.service';
import { TeacherService, Teacher } from '../../services/teacher.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  filteredTeachers: Teacher[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  loading = false;
  Math = Math;
  showModal = false;
  newLesson: Lesson = { id: 0, teacherId: 0, subjectId: 0, dayOfWeek: 'MONDAY', startTime: '', endTime: '', classRoom: '', isActive: true };
  searchTerm = '';
  isEditMode = false;
  editingLesson: Lesson | null = null;
  showDeleteModal = false;
  lessonToDelete: number | null = null;
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(
    private lessonService: LessonService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      lessons: this.lessonService.getAll(),
      teachers: this.teacherService.getAll(),
      subjects: this.lessonService.getAllSubjects()
    }).subscribe({
      next: (data) => {
        this.lessons = data.lessons.sort((a, b) => a.dayOfWeek.localeCompare(b.dayOfWeek));
        this.teachers = data.teachers;
        this.subjects = data.subjects;
        this.filteredLessons = this.lessons;
        this.totalPages = Math.ceil(this.filteredLessons.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  get paginatedLessons(): Lesson[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLessons.slice(start, end);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.showModal = true;
    this.filteredTeachers = [];
    this.newLesson = { id: 0, teacherId: 0, subjectId: 0, dayOfWeek: 'MONDAY', startTime: '', endTime: '', classRoom: '', isActive: true };
  }

  closeModal(): void {
    this.showModal = false;
  }

  addLesson(): void {
    if (this.isEditMode && this.editingLesson) {
      this.lessonService.update(this.editingLesson.id, this.newLesson).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (error) => console.error('Error updating lesson:', error)
      });
    } else {
      this.lessonService.create(this.newLesson).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (error) => console.error('Error adding lesson:', error)
      });
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredLessons = this.lessons;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLessons = this.lessons.filter(l => 
        l.classRoom.toLowerCase().includes(term) ||
        l.dayOfWeek.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredLessons.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editLesson(lesson: Lesson): void {
    this.isEditMode = true;
    this.editingLesson = lesson;
    this.newLesson = { ...lesson };
    this.onSubjectChange();
    this.showModal = true;
  }

  deleteLesson(id: number): void {
    this.lessonToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.lessonToDelete) {
      this.lessonService.delete(this.lessonToDelete).subscribe({
        next: () => {
          this.loadData();
          this.showDeleteModal = false;
          this.lessonToDelete = null;
        },
        error: (error) => console.error('Error deleting lesson:', error)
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.lessonToDelete = null;
  }

  getTeacherName(teacherId: number): string {
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A';
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'N/A';
  }

  onSubjectChange(): void {
    if (this.newLesson.subjectId > 0) {
      this.lessonService.getTeachersBySubjectFull(this.newLesson.subjectId).subscribe({
        next: (teachers) => {
          this.filteredTeachers = teachers;
          if (!this.filteredTeachers.some(t => t.id === this.newLesson.teacherId)) {
            this.newLesson.teacherId = 0;
          }
        },
        error: (error) => {
          console.error('Error loading teachers:', error);
          this.filteredTeachers = [];
        }
      });
    } else {
      this.filteredTeachers = [];
      this.newLesson.teacherId = 0;
    }
  }
}
