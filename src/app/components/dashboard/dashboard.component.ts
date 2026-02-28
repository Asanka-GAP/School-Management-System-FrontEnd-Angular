import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { TeacherService } from '../../services/teacher.service';
import { StudentService } from '../../services/student.service';
import { ParentService } from '../../services/parent.service';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('genderChart') genderChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('attendanceChart') attendanceChart!: ElementRef<HTMLCanvasElement>;
  teachersCount = 0;
  studentsCount = 0;
  parentsCount = 0;
  lessonsCount = 0;
  boysCount = 0;
  girlsCount = 0;
  recentEvents: any[] = [
    { title: 'Annual Sports Day', date: 'Dec 25, 2024' },
    { title: 'Parent-Teacher Meeting', date: 'Dec 20, 2024' },
    { title: 'Science Fair', date: 'Dec 18, 2024' }
  ];
  recentAnnouncements: any[] = [
    { title: 'Winter Break Schedule', date: 'Dec 15, 2024' },
    { title: 'New Admission Open', date: 'Dec 10, 2024' },
    { title: 'Exam Results Published', date: 'Dec 5, 2024' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private parentService: ParentService
  ) { }

  ngOnInit(): void {
    this.loadCounts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dashboardService.initializeDashboard();
      this.initializeCalendar();
    }, 100);
  }

  loadCounts(): void {
    forkJoin({
      teachers: this.teacherService.getAll(),
      students: this.studentService.getAll(),
      parents: this.parentService.getAll(),
      maleCount: this.studentService.countByGender('MALE'),
      femaleCount: this.studentService.countByGender('FEMALE')
    }).subscribe({
      next: (data) => {
        this.teachersCount = data.teachers.length;
        this.studentsCount = data.students.length;
        this.parentsCount = data.parents.length;
        this.lessonsCount = 0;
        
        this.boysCount = data.maleCount;
        this.girlsCount = data.femaleCount;
        
        console.log('Boys:', this.boysCount, 'Girls:', this.girlsCount);
        
        setTimeout(() => {
          this.dashboardService.initializeCounters();
          this.initializeGenderChart();
          this.initializeAttendanceChart();
        }, 500);
      },
      error: (error) => console.error('Error loading counts:', error)
    });
  }

  initializeCalendar(): void {
    const calendarEl = document.getElementById('mini-calendar');
    if (calendarEl) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const date = today.getDate();
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      
      let html = `
        <div class="calendar-header text-center mb-3">
          <h6 class="mb-0">${monthNames[month]} ${year}</h6>
        </div>
        <table class="table table-sm table-borderless text-center">
          <thead><tr>
            <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
          </tr></thead>
          <tbody><tr>`;
      
      for (let i = 0; i < firstDay; i++) {
        html += '<td></td>';
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
          html += '</tr><tr>';
        }
        const isToday = day === date;
        html += `<td><span class="${isToday ? 'badge bg-primary' : ''}">${day}</span></td>`;
      }
      
      html += '</tr></tbody></table>';
      calendarEl.innerHTML = html;
    }
  }

  initializeGenderChart(): void {
    console.log('Initializing chart...', this.genderChart);
    setTimeout(() => {
      if (this.genderChart && this.genderChart.nativeElement) {
        console.log('Creating chart with data:', this.boysCount, this.girlsCount);
        const ctx = this.genderChart.nativeElement.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Boys', 'Girls'],
              datasets: [{
                data: [this.boysCount || 0, this.girlsCount || 0],
                backgroundColor: ['#8b8fd6', '#ffd966'],
                borderWidth: 2,
                borderColor: '#fff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 15,
                    font: {
                      size: 12
                    }
                  }
                }
              }
            }
          });
        }
      } else {
        console.error('Chart element not available');
      }
    }, 100);
  }

  initializeAttendanceChart(): void {
    setTimeout(() => {
      if (this.attendanceChart && this.attendanceChart.nativeElement) {
        const ctx = this.attendanceChart.nativeElement.getContext('2d');
        if (ctx) {
          const last5Days = this.getLast5Days();
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: last5Days,
              datasets: [
                {
                  label: 'Present',
                  data: [85, 90, 88, 92, 87],
                  backgroundColor: '#8b8fd6',
                  borderWidth: 0
                },
                {
                  label: 'Absent',
                  data: [15, 10, 12, 8, 13],
                  backgroundColor: '#ffd966',
                  borderWidth: 0
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top'
                }
              },
              scales: {
                x: {
                  stacked: false
                },
                y: {
                  stacked: false,
                  beginAtZero: true
                }
              }
            }
          });
        }
      }
    }, 100);
  }

  getLast5Days(): string[] {
    const days = [];
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
  }
}