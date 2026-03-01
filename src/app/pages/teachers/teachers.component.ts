import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Teacher, TeacherService } from '../../services/teacher.service';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  loading = false;
  Math = Math;
  showModal = false;
  newTeacher: Teacher = { id: 0, firstName: '', lastName: '', email: '', subjectIds: [] };
  searchTerm = '';
  isEditMode = false;
  editingTeacher: Teacher | null = null;
  showDeleteModal = false;
  teacherToDelete: number | null = null;
  subjects: any[] = [];
  selectedSubject: string = '';

  constructor(private teacherService: TeacherService, private lessonService: LessonService) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadSubjects();
  }

  loadTeachers(): void {
    this.loading = true;
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data.sort((a, b) => 
          a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
        );
        this.filteredTeachers = this.teachers;
        this.totalPages = Math.ceil(this.filteredTeachers.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.showModal = true;
    this.selectedSubject = '';
    this.newTeacher = { id: 0, firstName: '', lastName: '', email: '', subjectIds: [] };
  }

  closeModal(): void {
    this.showModal = false;
  }

  addTeacher(): void {
    if (this.isEditMode && this.editingTeacher) {
      this.teacherService.update(this.editingTeacher.id, this.newTeacher).subscribe({
        next: () => {
          this.loadTeachers();
          this.closeModal();
        },
        error: (error) => console.error('Error updating teacher:', error)
      });
    } else {
      this.teacherService.create(this.newTeacher).subscribe({
        next: () => {
          this.loadTeachers();
          this.closeModal();
        },
        error: (error) => console.error('Error adding teacher:', error)
      });
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredTeachers = this.teachers;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTeachers = this.teachers.filter(t => 
        t.firstName.toLowerCase().includes(term) || 
        t.lastName.toLowerCase().includes(term) || 
        t.email.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredTeachers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editTeacher(teacher: Teacher): void {
    this.isEditMode = true;
    this.editingTeacher = teacher;
    this.selectedSubject = '';
    this.newTeacher = { ...teacher, subjectIds: [...(teacher.subjectIds || [])] };
    this.showModal = true;
  }

  get paginatedTeachers(): Teacher[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTeachers.slice(start, end);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const element = document.querySelector('.page-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  deleteTeacher(id: number): void {
    this.teacherToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.teacherToDelete) {
      this.teacherService.delete(this.teacherToDelete).subscribe({
        next: () => {
          this.loadTeachers();
          this.showDeleteModal = false;
          this.teacherToDelete = null;
        },
        error: (error) => console.error('Error deleting teacher:', error)
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.teacherToDelete = null;
  }

  loadSubjects(): void {
    this.lessonService.getAllSubjects().subscribe({
      next: (data: any) => {
        this.subjects = data;
      },
      error: (error: any) => console.error('Error loading subjects:', error)
    });
  }

  addSubject(): void {
    if (this.selectedSubject && !this.newTeacher.subjectIds.includes(+this.selectedSubject)) {
      this.newTeacher.subjectIds.push(+this.selectedSubject);
      this.selectedSubject = '';
    }
  }

  removeSubject(subjectId: number): void {
    this.newTeacher.subjectIds = this.newTeacher.subjectIds.filter(id => id !== subjectId);
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : '';
  }
}
