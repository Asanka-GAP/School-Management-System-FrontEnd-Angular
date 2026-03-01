import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, SubjectService } from '../../services/subject.service';
import { TeacherService, Teacher } from '../../services/teacher.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  loading = false;
  Math = Math;
  showModal = false;
  newSubject: Subject = { id: 0, name: '', code: '' };
  searchTerm = '';
  isEditMode = false;
  editingSubject: Subject | null = null;
  showDeleteModal = false;
  subjectToDelete: number | null = null;
  teachers: Teacher[] = [];
  selectedTeacher: string = '';

  constructor(private subjectService: SubjectService, private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadTeachers();
  }

  loadSubjects(): void {
    this.loading = true;
    this.subjectService.getAll().subscribe({
      next: (data) => {
        this.subjects = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredSubjects = this.subjects;
        this.totalPages = Math.ceil(this.filteredSubjects.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.loading = false;
      }
    });
  }

  get paginatedSubjects(): Subject[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredSubjects.slice(start, end);
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
    this.selectedTeacher = '';
    this.newSubject = { id: 0, name: '', code: '', teacherIds: [] };
  }

  closeModal(): void {
    this.showModal = false;
  }

  addSubject(): void {
    if (this.isEditMode && this.editingSubject) {
      this.subjectService.update(this.editingSubject.id, this.newSubject).subscribe({
        next: () => {
          this.loadSubjects();
          this.closeModal();
        },
        error: (error) => console.error('Error updating subject:', error)
      });
    } else {
      this.subjectService.create(this.newSubject).subscribe({
        next: () => {
          this.loadSubjects();
          this.closeModal();
        },
        error: (error) => console.error('Error adding subject:', error)
      });
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredSubjects = this.subjects;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSubjects = this.subjects.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.code.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredSubjects.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editSubject(subject: Subject): void {
    this.isEditMode = true;
    this.editingSubject = subject;
    this.newSubject = { ...subject };
    this.showModal = true;
  }

  deleteSubject(id: number): void {
    this.subjectToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.subjectToDelete) {
      this.subjectService.delete(this.subjectToDelete).subscribe({
        next: () => {
          this.loadSubjects();
          this.showDeleteModal = false;
          this.subjectToDelete = null;
        },
        error: (error) => console.error('Error deleting subject:', error)
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.subjectToDelete = null;
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (error) => console.error('Error loading teachers:', error)
    });
  }

  addTeacher(): void {
    if (this.selectedTeacher && !this.newSubject.teacherIds?.includes(+this.selectedTeacher)) {
      if (!this.newSubject.teacherIds) this.newSubject.teacherIds = [];
      this.newSubject.teacherIds.push(+this.selectedTeacher);
      this.selectedTeacher = '';
    }
  }

  removeTeacher(teacherId: number): void {
    if (this.newSubject.teacherIds) {
      this.newSubject.teacherIds = this.newSubject.teacherIds.filter(id => id !== teacherId);
    }
  }

  getTeacherName(teacherId: number): string {
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
  }
}
