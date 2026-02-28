import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student, StudentService } from '../../services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  loading = false;
  Math = Math;
  showModal = false;
  newStudent: Student = { id: 0, admissionNumber: '', firstName: '', lastName: '', dateOfBirth: '', admissionDate: '', status: 'ACTIVE', parentId: null, gender: 'MALE' };
  searchTerm = '';
  isEditMode = false;
  editingStudent: Student | null = null;
  showDeleteModal = false;
  studentToDelete: number | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data.sort((a, b) => 
          a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
        );
        this.filteredStudents = this.students;
        this.totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  get paginatedStudents(): Student[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredStudents.slice(start, end);
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
    this.newStudent = { id: 0, admissionNumber: '', firstName: '', lastName: '', dateOfBirth: '', admissionDate: '', status: 'ACTIVE', parentId: null, gender: 'MALE' };
  }

  closeModal(): void {
    this.showModal = false;
  }

  addStudent(): void {
    if (this.isEditMode && this.editingStudent) {
      this.studentService.update(this.editingStudent.id, this.newStudent).subscribe({
        next: () => {
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => console.error('Error updating student:', error)
      });
    } else {
      this.studentService.create(this.newStudent).subscribe({
        next: () => {
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => console.error('Error adding student:', error)
      });
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredStudents = this.students;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredStudents = this.students.filter(s => 
        s.firstName.toLowerCase().includes(term) || 
        s.lastName.toLowerCase().includes(term) || 
        s.admissionNumber.toLowerCase().includes(term) ||
        s.status.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editStudent(student: Student): void {
    this.isEditMode = true;
    this.editingStudent = student;
    this.newStudent = { ...student };
    this.showModal = true;
  }

  deleteStudent(id: number): void {
    this.studentToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.studentToDelete) {
      this.studentService.delete(this.studentToDelete).subscribe({
        next: () => {
          this.loadStudents();
          this.showDeleteModal = false;
          this.studentToDelete = null;
        },
        error: (error) => console.error('Error deleting student:', error)
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.studentToDelete = null;
  }
}
