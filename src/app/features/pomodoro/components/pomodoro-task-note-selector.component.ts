import { Component, inject, signal, input, output, OnInit, computed } from '@angular/core';
import { TasksService } from '../../tasks/services/tasks.service';
import { Task } from '../../../shared/models/pomodoro-task-note.model';

@Component({
  selector: 'app-pomodoro-task-selector',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6">
      <!-- Task Selection -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-semibold text-gray-800 flex items-center gap-2">
            What task will you focus on?
          </label>
          @if (selectedTask()) {
            <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              Task Selected
            </span>
          }
        </div>
        
        <select 
          [value]="internalTaskId()" 
          (change)="onTaskChange($any($event.target).value)"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-bg-app focus:ring-2 focus:ring-bg-app transition-all">
          @if(allTasks().length === 0){
                <option value="">Please Create a task to focus on...</option>
          }@else {
            <option value="">Choose a task to focus on...</option>
            @for (task of allTasks(); track task.id) {
              <option [value]="task.id">
                {{ task.title }}
              </option>
            }
          }
          
        </select>
        
        @if (selectedTask()) {
          <div class="bg-bg-app cursor-pointer shadow-sm border border-gray-200 hover:border-gray-300 hover:scale-102 rounded-lg p-4 transition-all duration-300">
            <div class="flex items-start gap-3">
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-gray-900 mb-1"> {{ selectedTask()?.title }}</h4>
                @if (selectedTask()?.description) {
                  <p class="text-xs text-gray-600 mb-2 leading-relaxed">{{ selectedTask()?.description }}</p>
                }
                <div class="flex flex-wrap gap-2 text-xs">
                  <span class="px-2 py-1 bg-white rounded-md text-gray-700 border border-gray-200">
                    Status: <strong>{{ selectedTask()?.status }}</strong>
                  </span>
                  <span class="px-2 py-1 bg-white rounded-md text-gray-700 border border-gray-200">
                    Type: <strong>{{ selectedTask()?.type }}</strong>
                  </span>
                  <span class="px-2 py-1 bg-white rounded-md text-gray-700 border border-gray-200">
                    Date: <strong>{{ selectedTask()?.date }}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="flex flex-wrap gap-3 pt-2">
        <button 
          (click)="clearSelection()"
          class="px-4 py-2 text-sm rounded-lg border bg-red-600/80 text-white hover:bg-red-600/90 cursor-pointer hover:scale-105 transition-all duration-300">
          Clear Selection
        </button>
      </div>
    </div>
  `,
  styles: [`

  `]
})
export class PomodoroTaskSelectorComponent implements OnInit {
  private tasksService = inject(TasksService);

  selectedTaskId = input<string>('');

  selectionChange = output<{ taskId?: string }>();

  // Internal writable signals for component state
  internalTaskId = signal<string>('');

  allTasks = signal<Task[]>([]);

  selectedTask = computed(() => this.allTasks().find(t => t.id === this.selectedTaskId() || this.internalTaskId()));

  ngOnInit() {
    this.loadData();

    // Initialize internal signal with input value
    this.internalTaskId.set(this.selectedTaskId());
  }

  private loadData() {
    const tasks = this.tasksService.tasks();
    this.allTasks.set(tasks);
  }

  onTaskChange(taskId: string) {
    this.internalTaskId.set(taskId);
    this.emitSelectionChange();
  }

  clearSelection() {
    this.internalTaskId.set('');
    this.emitSelectionChange();
  }

  private emitSelectionChange() {
    this.selectionChange.emit({
      taskId: this.internalTaskId() || undefined
    });
  }
}
