import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStats } from '../services/tasks-page.service';

@Component({
   selector: 'app-tasks-stats-bar',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-bg-card p-4 rounded-lg border border-border text-center">
        <p class="text-2xl font-bold text-text-main">{{ stats().total }}</p>
        <p class="text-xs text-text-muted uppercase tracking-wider">Total</p>
      </div>
      <div class="bg-bg-card p-4 rounded-lg border border-border text-center">
        <p class="text-2xl font-bold text-primary">{{ stats().done }}</p>
        <p class="text-xs text-text-muted uppercase tracking-wider">Done</p>
      </div>
      <div class="bg-bg-card p-4 rounded-lg border border-border text-center">
        <p class="text-2xl font-bold text-warning">{{ stats().pending }}</p>
        <p class="text-xs text-text-muted uppercase tracking-wider">Pending</p>
      </div>
      <div class="bg-bg-card p-4 rounded-lg border border-border text-center">
        <div class="flex items-center justify-center gap-2">
          <p class="text-2xl font-bold text-text-main">{{ stats().completionRate }}%</p>
        </div>
        <p class="text-xs text-text-muted uppercase tracking-wider">Complete</p>
      </div>
    </div>
  `
})
export class TasksStatsBarComponent {
   stats = input.required<TaskStats>();
}
