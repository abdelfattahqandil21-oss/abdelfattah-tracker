import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskType, TaskStatus } from '../../../shared/models/task.model';

interface KanbanColumn {
  status: TaskStatus;
  label: string;
  tasks: Task[];
}

interface KanbanBoard {
  type: TaskType;
  label: string;
  columns: KanbanColumn[];
}

@Component({
  selector: 'app-tasks-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      @for (board of boards(); track board.type; let boardIdx = $index) {
        <div class="bg-bg-card rounded-lg border border-border overflow-hidden">
          <!-- Board Header -->
          <div class="bg-bg-app px-4 py-3 border-b border-border">
            <h3 class="font-display font-bold text-primary uppercase tracking-wider text-sm">
              {{ board.label }} Tasks
            </h3>
          </div>

          <!-- Columns -->
          <div class="grid grid-cols-3 divide-x divide-border">
            @for (col of board.columns; track col.status; let colIdx = $index) {
              <div class="min-h-[200px]">
                <!-- Column Header -->
                <div class="px-3 py-2 border-b border-border flex items-center justify-between"
                  [class.bg-bg-app]="col.status === 'init'"
                  [class.bg-warning]="col.status === 'progress'"
                  [class.bg-primary]="col.status === 'done'">
                  <span class="text-xs font-bold uppercase tracking-wider"
                    [class.text-text-muted]="col.status === 'init'"
                    [class.text-text-main]="col.status === 'progress'"
                    [class.text-text-inverse]="col.status === 'done'">
                    {{ col.label }}
                  </span>
                  <span class="text-xs px-2 py-0.5 rounded-full"
                    [class.bg-primary]="col.status === 'init'"
                    [class.text-text-inverse]="col.status === 'init'"
                    [class.bg-text-main]="col.status === 'progress'"
                    [class.text-warning]="col.status === 'progress'"
                    [class.bg-text-inverse]="col.status === 'done'"
                    [class.text-primary]="col.status === 'done'">
                    {{ col.tasks.length }}
                  </span>
                </div>

                <!-- Tasks Drop Zone -->
                <div 
                  class="p-2 space-y-2 min-h-[150px]"
                  cdkDropList
                  [cdkDropListData]="{ boardIdx, colIdx, status: col.status, type: board.type }"
                  [cdkDropListConnectedTo]="getConnectedLists(boardIdx)"
                  [id]="'list-' + boardIdx + '-' + colIdx"
                  (cdkDropListDropped)="onDrop($event)">
                  
                  @for (task of col.tasks; track task.id) {
                    <div 
                      cdkDrag
                      [cdkDragData]="task"
                      class="bg-bg-app p-3 rounded border border-border hover:border-primary cursor-grab active:cursor-grabbing transition-colors group"
                      (click)="select.emit(task)">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-text-main truncate">{{ task.title }}</p>
                          @if (task.description) {
                            <p class="text-xs text-text-muted mt-1 line-clamp-2">{{ task.description }}</p>
                          }
                          <p class="text-xs text-text-muted mt-2">{{ task.date | date:'shortDate' }}</p>
                        </div>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            (click)="$event.stopPropagation(); delete.emit(task.id)"
                            class="w-6 h-6 rounded flex items-center justify-center text-error hover:bg-error hover:text-text-inverse transition-colors">
                            <i class="pi pi-trash text-xs"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Drag Placeholder -->
                      <div *cdkDragPlaceholder class="bg-primary/20 border-2 border-dashed border-primary rounded p-3 min-h-[60px]"></div>
                    </div>
                  }

                  @if (col.tasks.length === 0) {
                    <div class="text-center py-6 text-text-muted text-xs border-2 border-dashed border-border rounded">
                      Drop tasks here
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      opacity: 0.9;
    }
    .cdk-drag-animating {
      transition: transform 100ms ease-out;
    }
    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 100ms ease-out;
    }
  `]
})
export class TasksKanbanComponent {
  boards = input.required<KanbanBoard[]>();
  toggle = output<Task>();
  delete = output<string>();
  select = output<Task>();
  statusChange = output<{ task: Task; newStatus: TaskStatus }>();

  getConnectedLists(boardIdx: number): string[] {
    // Connect to all columns in the same board
    return [0, 1, 2].map(i => `list-${boardIdx}-${i}`);
  }

  onDrop(event: CdkDragDrop<{ boardIdx: number; colIdx: number; status: TaskStatus; type: TaskType }>) {
    const task = event.item.data as Task;
    const newStatus = event.container.data.status;

    if (task.status !== newStatus) {
      this.statusChange.emit({ task, newStatus });
    }
  }
}
