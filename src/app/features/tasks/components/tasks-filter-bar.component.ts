import { Component, ChangeDetectionStrategy, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent, FilterSection } from '../../../shared/components/filter-bar/filter-bar.component';
import { FilterType } from '../services/tasks-page.service';
import { TaskType } from '../../../shared/models/task.model';

@Component({
  selector: 'app-tasks-filter-bar',
  standalone: true,
  imports: [CommonModule, FilterBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-filter-bar [sections]="filterSections()" [customContent]="true">
      <div class="space-y-2">
        <label class="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
          <i class="pi pi-eye text-primary"></i>
          View
        </label>
        <ng-content></ng-content>
      </div>
    </app-filter-bar>
  `
})
export class TasksFilterBarComponent {
  activeFilter = input.required<FilterType>();
  activeType = input.required<TaskType | 'all'>();
  filterChange = output<FilterType>();
  typeChange = output<TaskType | 'all'>();

  private filterChangeEmitter = new EventEmitter<string>();
  private typeChangeEmitter = new EventEmitter<string>();

  filterSections(): FilterSection[] {
    return [
      {
        label: 'Time Period',
        icon: 'pi-calendar',
        activeValue: this.activeFilter(),
        change: this.filterChangeEmitter,
        options: [
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'This Week' },
          { value: 'month', label: 'This Month' },
          { value: 'all', label: 'All' }
        ]
      },
      {
        label: 'Task Type',
        icon: 'pi-tag',
        activeValue: this.activeType(),
        change: this.typeChangeEmitter,
        options: [
          { value: 'all', label: 'All' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' }
        ]
      }
    ];
  }

  constructor() {
    this.filterChangeEmitter.subscribe((value) => {
      this.filterChange.emit(value as FilterType);
    });
    
    this.typeChangeEmitter.subscribe((value) => {
      this.typeChange.emit(value as TaskType | 'all');
    });
  }
}
