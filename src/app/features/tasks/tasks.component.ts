import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { HeaderComponent } from '../main/header/header.component';
import { TasksPageService, FilterType } from './services/tasks-page.service';
import { TasksFilterBarComponent } from './components/tasks-filter-bar.component';
import { TasksStatsBarComponent } from './components/tasks-stats-bar.component';
import { TasksQuickAddComponent } from './components/tasks-quick-add.component';
import { TasksTableComponent } from './components/tasks-table.component';
import { TasksKanbanComponent } from './components/tasks-kanban.component';
import { TaskDetailModalComponent } from './components/task-detail-modal.component';
import { Task, TaskType, TaskStatus } from '../../shared/models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    HeaderComponent,
    TasksFilterBarComponent,
    TasksStatsBarComponent,
    TasksQuickAddComponent,
    TasksTableComponent,
    TasksKanbanComponent,
    TaskDetailModalComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  protected service = inject(TasksPageService);
  selectedTask = signal<Task | null>(null);
  viewMode = signal<'list' | 'kanban'>('kanban');

  onFilterChange(filter: FilterType) {
    this.service.setFilter(filter);
  }

  onTypeChange(type: TaskType | 'all') {
    this.service.setType(type);
  }

  onTaskAdded(data: { title: string; date: string; type: TaskType; description?: string }) {
    this.service.addTask(data.title, data.date, data.type, data.description);
  }

  onToggle(task: Task) {
    this.service.toggleStatus(task);
  }

  onDelete(id: string) {
    this.service.deleteTask(id);
  }

  onSelect(task: Task) {
    this.selectedTask.set(task);
  }

  closeModal() {
    this.selectedTask.set(null);
  }

  onStatusChange(event: { task: Task; newStatus: TaskStatus }) {
    this.service.updateTaskStatus(event.task, event.newStatus);
  }
}
