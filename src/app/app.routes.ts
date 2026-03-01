import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarComponent } from './pages/apps/calendar/calendar.component';
import { ChatComponent } from './pages/apps/chat/chat.component';
import { InboxComponent } from './pages/apps/email/inbox/inbox.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ButtonsComponent } from './pages/ui/buttons/buttons.component';
import { ApexComponent } from './pages/charts/apex/apex.component';
import { ChartjsComponent } from './pages/charts/chartjs/chartjs.component';
import { EchartComponent } from './pages/charts/echart/echart.component';
import { KnobComponent } from './pages/charts/knob/knob.component';
import { SparklineComponent } from './pages/charts/sparkline/sparkline.component';
import { BasicComponent } from './pages/tables/basic/basic.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { TeacherDetailComponent } from './pages/teachers/teacher-detail/teacher-detail.component';
import { StudentsComponent } from './pages/students/students.component';
import { ParentsComponent } from './pages/parents/parents.component';
import { LessonsComponent } from './pages/lessons/lessons.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { ClassesComponent } from './pages/classes/classes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  // Apps Routes
  { path: 'apps/calendar', component: CalendarComponent },
  { path: 'apps/chat', component: ChatComponent },
  { path: 'apps/email/inbox', component: InboxComponent },
  
  // Authentication Routes
  { path: 'auth/login', component: LoginComponent },
  
  // UI Components Routes
  { path: 'ui/buttons', component: ButtonsComponent },
  
  // Charts Routes
  { path: 'charts/apex', component: ApexComponent },
  { path: 'charts/chartjs', component: ChartjsComponent },
  { path: 'charts/echart', component: EchartComponent },
  { path: 'charts/knob', component: KnobComponent },
  { path: 'charts/sparkline', component: SparklineComponent },
  
  // Tables Routes
  { path: 'tables/basic', component: BasicComponent },
  
  // Teachers Route
  { path: 'teachers', component: TeachersComponent },
  { path: 'teachers/:id', component: TeacherDetailComponent },
  
  // Students Route
  { path: 'students', component: StudentsComponent },
  
  // Parents Route
  { path: 'parents', component: ParentsComponent },
  
  // Lessons Route
  { path: 'lessons', component: LessonsComponent },
  
  // Subjects Route
  { path: 'subjects', component: SubjectsComponent },
  
  // Classes Route
  { path: 'classes', component: ClassesComponent },
  
  // Wildcard route
  { path: '**', redirectTo: '/dashboard' }
];