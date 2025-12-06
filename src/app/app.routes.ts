import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./features/main/main.component').then(
        (m) => m.MainComponent
      ),
  },
  {
    path: 'sugar-tracker',
    loadComponent: () =>
      import('./features/sugar-tracker/sugar-tracker.component').then(
        (m) => m.SugarTrackerComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },
  {
    path: 'evaluations',
    loadComponent: () =>
      import('./features/evaluations/evaluations.component').then(
        (m) => m.EvaluationsComponent
      ),
  },
  {
    path: 'notes',
    loadComponent: () =>
      import('./features/notes/notes.component').then(
        (m) => m.NotesComponent
      ),
  },
];
