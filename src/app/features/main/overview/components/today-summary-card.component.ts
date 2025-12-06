import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodaySummary } from '../services/overview.service';

@Component({
  selector: 'app-today-summary-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-48">
      <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider mb-4">Today's Summary</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-text-muted text-sm">Sugar Readings</span>
          <span class="font-bold text-text-main">{{ summary().sugarReadings }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-text-muted text-sm">Avg Sugar</span>
          <span class="font-bold"
            [class.text-green-600]="summary().avgSugar && summary().avgSugar! <= 140"
            [class.text-yellow-600]="summary().avgSugar && summary().avgSugar! > 140 && summary().avgSugar! <= 180"
            [class.text-red-600]="summary().avgSugar && summary().avgSugar! > 180"
            [class.text-text-muted]="!summary().avgSugar">
            {{ summary().avgSugar || '---' }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-text-muted text-sm">Tasks</span>
          <span class="font-bold text-text-main">{{ summary().tasksCompleted }}/{{ summary().tasksTotal }}</span>
        </div>
      </div>
    </div>
  `
})
export class TodaySummaryCardComponent {
  summary = input.required<TodaySummary>();
}
