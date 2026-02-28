# Angular Admin Dashboard

This project is an Angular conversion of the HTML Bootstrap 5 Admin Dashboard Template. It features a modern, responsive design with multiple layouts, theme options, and comprehensive routing for all template pages.

## Features

- **Angular 18+** - Latest Angular framework
- **Bootstrap 5.3.3** - Modern CSS framework
- **Comprehensive Routing** - All template pages converted to Angular routes
- **Responsive Design** - Works on all devices
- **Multiple Layouts** - Vertical and horizontal layouts
- **Theme Support** - Light, Dark, and RTL modes
- **Charts & Widgets** - ApexCharts integration
- **Icon Libraries** - Feather Icons, Font Awesome, Material Design Icons
- **Modular Components** - Reusable Angular components

## Available Routes

### Dashboard
- `/dashboard` - Main dashboard with widgets and charts

### Apps
- `/apps/calendar` - Calendar application with FullCalendar
- `/apps/chat` - Chat application interface
- `/apps/email/inbox` - Email inbox interface

### Authentication
- `/auth/login` - Login page with social authentication options

### UI Components
- `/ui/buttons` - Various button styles and states

### Charts
- `/charts/apex` - ApexCharts examples (Line, Area, Column, Bar, Pie, Donut, Radial)

### Tables
- `/tables/basic` - Basic table examples with different styles

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard component
│   │   └── layout/
│   │       ├── header/         # Header navigation
│   │       └── sidebar/        # Sidebar navigation with routing
│   ├── pages/
│   │   ├── apps/
│   │   │   ├── calendar/       # Calendar page
│   │   │   ├── chat/           # Chat page
│   │   │   └── email/
│   │   │       └── inbox/      # Email inbox
│   │   ├── auth/
│   │   │   └── login/          # Login page
│   │   ├── charts/
│   │   │   └── apex/           # Apex charts
│   │   ├── tables/
│   │   │   └── basic/          # Basic tables
│   │   └── ui/
│   │       └── buttons/        # UI buttons
│   ├── services/
│   │   └── dashboard.service.ts # Dashboard utilities
│   ├── app.component.*         # Main app component with layout
│   ├── app.config.ts          # App configuration
│   └── app.routes.ts          # Comprehensive routing configuration
├── assets/                    # Static assets from original template
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── images/               # Images and icons
│   └── libs/                 # Third-party libraries
└── styles.scss               # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Navigate to the project directory:
   ```bash
   cd E:\NG\admin-dashboard-angular
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
ng build --configuration production
```

## Navigation

The sidebar navigation includes proper Angular routing with `routerLink` and `routerLinkActive` directives:

- **Dashboard** - Main dashboard page
- **Apps** - Application pages (Calendar, Chat, Email)
- **Authentication** - Login and auth pages
- **Pages** - Static pages (Coming Soon, 404, etc.)
- **Components** - UI components (Buttons, Cards, etc.)
- **Extended** - Extended UI components
- **Forms** - Form components and validation
- **Tables** - Table components and data tables
- **Charts** - Chart components (Apex, Chart.js, etc.)
- **Icons** - Icon libraries
- **Maps** - Map integrations
- **Multi Level** - Multi-level menu example

## Components

### Layout Components

- **HeaderComponent** - Top navigation bar with user menu, notifications, and search
- **SidebarComponent** - Left sidebar with navigation menu and routing
- **DashboardComponent** - Main dashboard with widgets and charts

### Page Components

- **CalendarComponent** - Calendar interface with FullCalendar integration
- **ChatComponent** - Chat application interface
- **InboxComponent** - Email inbox interface
- **LoginComponent** - Authentication login page
- **ButtonsComponent** - UI buttons showcase
- **ApexComponent** - Charts showcase with ApexCharts
- **BasicComponent** - Basic tables examples

### Services

- **DashboardService** - Handles dashboard initialization, counters, and chart setup

## Routing Features

- **Lazy Loading** - Planned for forms, pages, and icons modules
- **Route Guards** - Can be added for authentication
- **Active Link Highlighting** - Using `routerLinkActive`
- **Breadcrumb Navigation** - Implemented in page headers
- **Nested Routing** - Support for multi-level navigation

## Customization

### Adding New Routes

1. Create a new component:
   ```bash
   ng generate component pages/your-component
   ```

2. Add the route to `app.routes.ts`:
   ```typescript
   { path: 'your-path', component: YourComponent }
   ```

3. Update the sidebar navigation in `sidebar.component.html`:
   ```html
   <li><a routerLink="/your-path" routerLinkActive="active">Your Page</a></li>
   ```

### Theme Customization

The template supports multiple themes and layouts:
- Light/Dark mode toggle
- RTL support
- Sidebar size options
- Layout variations

Themes are controlled through CSS classes and can be customized in the assets/css files.

### Adding Charts

The project uses ApexCharts for data visualization. To add new charts:

1. Include chart options in your component
2. Initialize charts in `ngAfterViewInit()`
3. Use the dashboard service for common chart utilities

## Original Template Pages

The following pages from the original HTML template are available or planned:

### Implemented
- ✅ Dashboard (`/dashboard`)
- ✅ Calendar (`/apps/calendar`)
- ✅ Chat (`/apps/chat`)
- ✅ Email Inbox (`/apps/email/inbox`)
- ✅ Login (`/auth/login`)
- ✅ Buttons (`/ui/buttons`)
- ✅ Apex Charts (`/charts/apex`)
- ✅ Basic Tables (`/tables/basic`)

### Planned for Implementation
- 📋 Blog pages (Grid, List, Detail)
- 📋 Invoice pages (List, Detail)
- 📋 Contact pages (Grid, List, Profile)
- 📋 Authentication pages (Register, Recover Password, etc.)
- 📋 Error pages (404, 500)
- 📋 Utility pages (Coming Soon, Maintenance, etc.)
- 📋 Form components (Elements, Validation, Advanced, etc.)
- 📋 Additional UI components (Cards, Modals, etc.)
- 📋 Additional chart types (Chart.js, ECharts, etc.)
- 📋 Data tables with sorting and filtering
- 📋 Icon showcases
- 📋 Map integrations

## Dependencies

### Core Dependencies
- Angular 18+
- Bootstrap 5.3.3
- ApexCharts
- jQuery
- Feather Icons

### Development Dependencies
- Angular CLI
- TypeScript
- SCSS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is based on the HTML Bootstrap 5 Admin Dashboard Template. Please refer to the original template's license for usage terms.

## Support

For issues and questions:
1. Check the original template documentation
2. Review Angular documentation
3. Create an issue in the project repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

- [ ] Complete all remaining page components
- [ ] Add lazy loading for modules
- [ ] Implement route guards for authentication
- [ ] Add unit tests for components
- [ ] Add e2e tests
- [ ] Implement state management (NgRx)
- [ ] Add PWA support
- [ ] Add internationalization (i18n)