import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPeriod } from '../services/evaluations-page.service';

@Component({
   selector: 'app-eval-filter-bar',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="bg-bg-card p-4 rounded-lg border border-border">
      <div class="flex items-center gap-4">
        <label class="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
          <i class="pi pi-calendar text-primary"></i>
          Time Period
        </label>
        <div class="flex gap-1">
          @for (p of periods; track p.value) {
            <button 
              (click)="periodChange.emit(p.value)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
              [class.bg-primary]="activePeriod() === p.value"
              [class.text-text-inverse]="activePeriod() === p.value"
              [class.border-primary]="activePeriod() === p.value"
              [class.bg-bg-app]="activePeriod() !== p.value"
              [class.text-text-main]="activePeriod() !== p.value"
              [class.border-border]="activePeriod() !== p.value"
              [class.hover:border-primary]="activePeriod() !== p.value">
              {{ p.label }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class EvalFilterBarComponent {
   activePeriod = input.required<FilterPeriod>();
   periodChange = output<FilterPeriod>();

   periods = [
      { value: 'week' as FilterPeriod, label: 'Last 7 Days' },
      { value: 'month' as FilterPeriod, label: 'This Month' },
      { value: 'all' as FilterPeriod, label: 'All Time' }
   ];
}
