import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var feather: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  ngAfterViewInit() {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  expandSidebar() {
    const sidebar = document.querySelector('.vertical-menu');
    sidebar?.classList.remove('collapsed');
    this.sidebarToggle.emit(false);
    setTimeout(() => {
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    }, 100);
  }

  collapseSidebar() {
    const sidebar = document.querySelector('.vertical-menu');
    sidebar?.classList.add('collapsed');
    this.sidebarToggle.emit(true);
  }
}