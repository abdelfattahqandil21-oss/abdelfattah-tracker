import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../shared/models/task.model';

interface DateGroup {
  date: string;
  dateFormatted: string;
  tasks: Task[];
  done: number;
  total: number;
}

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (groups().length === 0) {
      <div class="bg-bg-card p-12 rounded-lg border border-border text-center">
        <i class="pi pi-inbox text-4xl text-text-muted mb-4"></i>
        <p class="text-text-muted">No tasks found for this filter</p>
      </div>
    } @else {
      <div class="space-y-4">
        @for (group of groups(); track group.date) {
          <div class="bg-bg-card rounded-lg border border-border overflow-hidden">
            <!-- Date Header -->
            <div class="bg-bg-app px-4 py-3 border-b border-border flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="font-bold text-text-main">{{ group.dateFormatted }}</span>
                <span class="text-xs text-text-muted">({{ group.done }}/{{ group.total }})</span>
              </div>
              <div class="w-20 h-2 bg-border rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full transition-all" 
                  [style.width.%]="group.total > 0 ? (group.done / group.total) * 100 : 0"></div>
              </div>
            </div>

            <!-- Tasks List -->
            <div class="divide-y divide-border">
              @for (task of group.tasks; track task.id) {
                <div 
                  class="px-4 py-3 group hover:bg-bg-app transition-colors cursor-pointer"
                  (click)="select.emit(task)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <!-- Checkbox -->
                      <button 
                        (click)="$event.stopPropagation(); toggle.emit(task)"
                        class="w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0"
                        [class.bg-primary]="task.status === 'done'"
                        [class.border-primary]="task.status === 'done'"
                        [class.border-border]="task.status !== 'done'">
                        @if (task.status === 'done') {
                          <i class="pi pi-check text-text-inverse text-xs"></i>
                        }
                      </button>

                      <div class="flex-1">
                        <!-- Title -->
                        <span 
                          class="font-medium"
                          [class.line-through]="task.status === 'done'"
                          [class.text-text-muted]="task.status === 'done'"
                          [class.text-text-main]="task.status !== 'done'">
                          {{ task.title }}
                        </span>

                        <!-- Description -->
                        @if (task.description) {
                          <p class="text-xs text-text-muted mt-1 line-clamp-1">{{ task.description }}</p>
                        }
                      </div>

                      <!-- Type Badge -->
                      <span class="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                        [class.bg-bg-app]="task.type === 'daily'"
                        [class.text-primary]="task.type === 'daily'"
                        [class.bg-warning]="task.type === 'weekly'"
                        [class.text-text-main]="task.type === 'weekly'"
                        [class.bg-error]="task.type === 'monthly'"
                        [class.text-text-inverse]="task.type === 'monthly'">
                        {{ task.type }}
                      </span>
                    </div>

                    <!-- Actions -->
                    <button 
                      (click)="$event.stopPropagation(); delete.emit(task.id)"
                      class="text-error opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
  `
})
export class TasksTableComponent {
  groups = input.required<DateGroup[]>();
  toggle = output<Task>();
  delete = output<string>();
  select = output<Task>();
}
