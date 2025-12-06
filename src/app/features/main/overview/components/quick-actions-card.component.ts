import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-actions-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-48">
      <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 gap-3">
        <a routerLink="/sugar-tracker" class="flex items-center gap-2 p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary transition-colors text-sm font-medium">
          <i class="pi pi-plus-circle"></i> Add Sugar
        </a>
        <a routerLink="/tasks" class="flex items-center gap-2 p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary transition-colors text-sm font-medium">
          <i class="pi pi-check-square"></i> Add Task
        </a>
        <a routerLink="/evaluations" class="flex items-center gap-2 p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary transition-colors text-sm font-medium">
          <i class="pi pi-chart-bar"></i> Evaluate
        </a>
        <a routerLink="/notes" class="flex items-center gap-2 p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary transition-colors text-sm font-medium">
          <i class="pi pi-file-edit"></i> Add Note
        </a>
      </div>
    </div>
  `
})
export class QuickActionsCardComponent { }
