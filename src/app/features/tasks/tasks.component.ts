import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from './services/tasks.service';
import { TaskType } from '../../shared/models/task.model';
import { HeaderComponent } from '../main/header/header.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  private service = inject(TasksService);
  tasks = this.service.tasks;

  newTaskTitle = signal('');
  newTaskType = signal<TaskType>('daily');
  newTaskDate = signal(new Date().toISOString().split('T')[0]);

  filteredTasks = computed(() => {
    return this.tasks().filter(t => t.date === this.newTaskDate());
  });

  addTask() {
    if (!this.newTaskTitle()) return;

    const task = this.service.createTask(
      this.newTaskTitle(),
      this.newTaskDate(),
      this.newTaskType()
    );

    this.service.addOrUpdate(task);
    this.newTaskTitle.set('');
  }

  toggleStatus(task: any) {
    const updatedTask = {
      ...task,
      status: task.status === 'done' ? 'init' : 'done'
    };
    this.service.addOrUpdate(updatedTask);
  }

  deleteTask(id: string) {
    if (confirm('Are you sure?')) {
      this.service.delete(id);
    }
  }
}
