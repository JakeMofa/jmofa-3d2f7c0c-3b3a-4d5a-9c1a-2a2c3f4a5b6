import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks.component').then((m) => m.TasksComponent),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
