import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Parent, ParentService } from '../../services/parent.service';

@Component({
  selector: 'app-parents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.scss']
})
export class ParentsComponent implements OnInit {
  parents: Parent[] = [];
  filteredParents: Parent[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  loading = false;
  Math = Math;
  showModal = false;
  newParent: Parent = { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '' };
  searchTerm = '';
  isEditMode = false;
  editingParent: Parent | null = null;
  showDeleteModal = false;
  parentToDelete: number | null = null;

  constructor(private parentService: ParentService) {}

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents(): void {
    this.loading = true;
    this.parentService.getAll().subscribe({
      next: (data) => {
        this.parents = data.sort((a, b) => 
          a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
        );
        this.filteredParents = this.parents;
        this.totalPages = Math.ceil(this.filteredParents.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading parents:', error);
        this.loading = false;
      }
    });
  }

  get paginatedParents(): Parent[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredParents.slice(start, end);
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
    this.newParent = { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '' };
  }

  closeModal(): void {
    this.showModal = false;
  }

  addParent(): void {
    if (this.isEditMode && this.editingParent) {
      this.parentService.update(this.editingParent.id, this.newParent).subscribe({
        next: () => {
          this.loadParents();
          this.closeModal();
        },
        error: (error) => console.error('Error updating parent:', error)
      });
    } else {
      this.parentService.create(this.newParent).subscribe({
        next: () => {
          this.loadParents();
          this.closeModal();
        },
        error: (error) => console.error('Error adding parent:', error)
      });
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredParents = this.parents;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredParents = this.parents.filter(p => 
        p.firstName.toLowerCase().includes(term) || 
        p.lastName.toLowerCase().includes(term) || 
        p.email.toLowerCase().includes(term) ||
        p.phoneNumber.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(this.filteredParents.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  editParent(parent: Parent): void {
    this.isEditMode = true;
    this.editingParent = parent;
    this.newParent = { ...parent };
    this.showModal = true;
  }

  deleteParent(id: number): void {
    this.parentToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.parentToDelete) {
      this.parentService.delete(this.parentToDelete).subscribe({
        next: () => {
          this.loadParents();
          this.showDeleteModal = false;
          this.parentToDelete = null;
        },
        error: (error) => console.error('Error deleting parent:', error)
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.parentToDelete = null;
  }
}
