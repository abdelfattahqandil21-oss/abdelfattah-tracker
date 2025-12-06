import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterType } from '../services/tasks-page.service';
import { TaskType } from '../../../shared/models/task.model';

@Component({
  selector: 'app-tasks-filter-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-4 rounded-lg border border-border">
      <div class="flex flex-wrap gap-6 items-start justify-between">
        
        <!-- Date Filters Section -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <i class="pi pi-calendar text-primary"></i>
            Time Period
          </label>
          <div class="flex gap-1">
            @for (f of filters; track f.value) {
              <button 
                (click)="filterChange.emit(f.value)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                [class.bg-primary]="activeFilter() === f.value"
                [class.text-text-inverse]="activeFilter() === f.value"
                [class.border-primary]="activeFilter() === f.value"
                [class.bg-bg-app]="activeFilter() !== f.value"
                [class.text-text-main]="activeFilter() !== f.value"
                [class.border-border]="activeFilter() !== f.value"
                [class.hover:border-primary]="activeFilter() !== f.value">
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <!-- Divider -->
        <div class="hidden md:block w-px h-12 bg-border self-center"></div>

        <!-- Type Filters Section -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <i class="pi pi-tag text-primary"></i>
            Task Type
          </label>
          <div class="flex gap-1">
            @for (t of types; track t.value) {
              <button 
                (click)="typeChange.emit(t.value)"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-colors border"
                [class.bg-primary]="activeType() === t.value"
                [class.text-text-inverse]="activeType() === t.value"
                [class.border-primary]="activeType() === t.value"
                [class.bg-bg-app]="activeType() !== t.value"
                [class.text-text-main]="activeType() !== t.value"
                [class.border-border]="activeType() !== t.value"
                [class.hover:border-primary]="activeType() !== t.value">
                {{ t.label }}
              </button>
            }
          </div>
        </div>

        <!-- Divider -->
        <div class="hidden md:block w-px h-12 bg-border self-center"></div>

        <!-- View Toggle Section -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <i class="pi pi-eye text-primary"></i>
            View
          </label>
          <ng-content></ng-content>
        </div>

      </div>
    </div>
  `
})
export class TasksFilterBarComponent {
  activeFilter = input.required<FilterType>();
  activeType = input.required<TaskType | 'all'>();
  filterChange = output<FilterType>();
  typeChange = output<TaskType | 'all'>();

  filters = [
    { value: 'today' as FilterType, label: 'Today' },
    { value: 'week' as FilterType, label: 'This Week' },
    { value: 'month' as FilterType, label: 'This Month' },
    { value: 'all' as FilterType, label: 'All' }
  ];

  types = [
    { value: 'all' as const, label: 'All' },
    { value: 'daily' as TaskType, label: 'Daily' },
    { value: 'weekly' as TaskType, label: 'Weekly' },
    { value: 'monthly' as TaskType, label: 'Monthly' }
  ];
}
