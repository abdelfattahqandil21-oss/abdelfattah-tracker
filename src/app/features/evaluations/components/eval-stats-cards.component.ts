import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvalStats } from '../services/evaluations-page.service';

@Component({
   selector: 'app-eval-stats-cards',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Activity -->
      <div class="bg-bg-card p-4 rounded-lg border border-border">
        <div class="flex items-center justify-between mb-2">
          <i class="pi pi-bolt text-2xl text-primary"></i>
          @if (stats().activity.trend === 'up') {
            <i class="pi pi-arrow-up text-success text-sm"></i>
          } @else if (stats().activity.trend === 'down') {
            <i class="pi pi-arrow-down text-error text-sm"></i>
          }
        </div>
        <p class="text-2xl font-bold" [class]="getScoreColor(stats().activity.avg)">
          {{ stats().activity.avg || '—' }}
        </p>
        <p class="text-xs text-text-muted uppercase tracking-wider">Activity</p>
        <p class="text-xs text-text-muted mt-1">{{ stats().activity.count }} entries</p>
      </div>

      <!-- Health -->
      <div class="bg-bg-card p-4 rounded-lg border border-border">
        <div class="flex items-center justify-between mb-2">
          <i class="pi pi-heart text-2xl text-primary"></i>
          @if (stats().health.trend === 'up') {
            <i class="pi pi-arrow-up text-success text-sm"></i>
          } @else if (stats().health.trend === 'down') {
            <i class="pi pi-arrow-down text-error text-sm"></i>
          }
        </div>
        <p class="text-2xl font-bold" [class]="getScoreColor(stats().health.avg)">
          {{ stats().health.avg || '—' }}
        </p>
        <p class="text-xs text-text-muted uppercase tracking-wider">Health</p>
        <p class="text-xs text-text-muted mt-1">{{ stats().health.count }} entries</p>
      </div>

      <!-- Productivity -->
      <div class="bg-bg-card p-4 rounded-lg border border-border">
        <div class="flex items-center justify-between mb-2">
          <i class="pi pi-chart-line text-2xl text-primary"></i>
          @if (stats().productivity.trend === 'up') {
            <i class="pi pi-arrow-up text-success text-sm"></i>
          } @else if (stats().productivity.trend === 'down') {
            <i class="pi pi-arrow-down text-error text-sm"></i>
          }
        </div>
        <p class="text-2xl font-bold" [class]="getScoreColor(stats().productivity.avg)">
          {{ stats().productivity.avg || '—' }}
        </p>
        <p class="text-xs text-text-muted uppercase tracking-wider">Productivity</p>
        <p class="text-xs text-text-muted mt-1">{{ stats().productivity.count }} entries</p>
      </div>

      <!-- Overall -->
      <div class="bg-primary/10 p-4 rounded-lg border border-primary">
        <div class="flex items-center justify-between mb-2">
          <i class="pi pi-star-fill text-2xl text-primary"></i>
        </div>
        <p class="text-2xl font-bold text-primary">
          {{ stats().overall.avg || '—' }}
        </p>
        <p class="text-xs text-primary uppercase tracking-wider font-bold">Overall</p>
        <p class="text-xs text-text-muted mt-1">{{ stats().overall.count }} total</p>
      </div>
    </div>
  `
})
export class EvalStatsCardsComponent {
   stats = input.required<EvalStats>();

   getScoreColor(score: number): string {
      if (score >= 8) return 'text-success';
      if (score >= 5) return 'text-warning';
      if (score > 0) return 'text-error';
      return 'text-text-muted';
   }
}
