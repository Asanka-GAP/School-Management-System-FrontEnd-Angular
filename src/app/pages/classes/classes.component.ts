import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolClass, ClassService } from '../../services/class.service';
import { Teacher, TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  classes: SchoolClass[] = [];
  filteredClasses: SchoolClass[] = [];
  teachers: Teacher[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  loading = false;
  Math = Math;
  showModal = false;
  newClass: SchoolClass = { id: 0, className: '', grade: 1, character: 'A', capacity: 30 };
  searchTerm = '';
  isEditMode = false;
  editingClass: SchoolClass | null = null;
  showDeleteModal = false;
  classToDelete: number | null = null;
  classNameError = '';

  constructor(private classService: ClassService, private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
  }

  loadClasses(): void {
    this.loading = true;
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data.sort((a, b) => a.className.localeCompare(b.className));
        this.filteredClasses = this.classes;
        this.totalPages = Math.ceil(this.filteredClasses.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.loading = false;
      }
    });
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (data) => this.teachers = data
    });
  }

  get paginatedClasses(): SchoolClass[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredClasses.slice(start, end);
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

  openAddModal(): void {
    this.isEditMode = false;
    this.showModal = true;
    this.classNameError = '';
    this.newClass = { id: 0, className: '', grade: 1, character: 'A', capacity: 30 };
  }

  closeModal(): void {
    this.showModal = false;
  }

  addClass(): void {
    this.newClass.character = this.newClass.character.toUpperCase();
    const className = this.newClass.grade + this.newClass.character;
    
    const exists = this.classes.some(c => 
      c.className === className && c.id !== this.newClass.id
    );
    
    if (exists) {
      this.classNameError = 'This class already exists';
      return;
    }
    
    this.classNameError = '';
    
    if (!this.newClass.capacity) {
      this.newClass.capacity = 0;
    }
    
    if (this.isEditMode && this.editingClass) {
      this.classService.update(this.editingClass.id, this.newClass).subscribe({
        next: () => {
          this.loadClasses();
          this.closeModal();
        },
        error: (error) => console.error('Error updating class:', error)
      });
    } else {
      this.classService.create(this.newClass).subscribe({
        next: () => {
          this.loadClasses();
          this.closeModal();
        },
        error: (error) => console.error('Error adding class:', error)
      });
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredClasses = this.classes;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClasses = this.classes.filter(c => 
        c.className.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredClasses.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editClass(schoolClass: SchoolClass): void {
    this.isEditMode = true;
    this.editingClass = schoolClass;
    this.classNameError = '';
    this.newClass = { ...schoolClass };
    this.showModal = true;
  }

  deleteClass(id: number): void {
    this.classToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.classToDelete) {
      this.classService.delete(this.classToDelete).subscribe({
        next: () => {
          this.loadClasses();
          this.showDeleteModal = false;
          this.classToDelete = null;
        },
        error: (error) => console.error('Error deleting class:', error)
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.classToDelete = null;
  }

  getTeacherName(supervisorId?: number): string {
    if (!supervisorId) return 'No Supervisor';
    const teacher = this.teachers.find(t => t.id === supervisorId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  }

  checkClassName(): void {
    this.newClass.character = this.newClass.character.toUpperCase();
    const className = this.newClass.grade + this.newClass.character;
    
    const exists = this.classes.some(c => 
      c.className === className && c.id !== this.newClass.id
    );
    
    this.classNameError = exists ? 'This class already exists' : '';
  }
}
