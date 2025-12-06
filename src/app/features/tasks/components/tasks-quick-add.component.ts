import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskType } from '../../../shared/models/task.model';

@Component({
  selector: 'app-tasks-quick-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-4 rounded-lg border border-border">
      <div class="flex gap-2 mb-3">
        <input 
          type="text" 
          [ngModel]="title()" 
          (ngModelChange)="title.set($event)"
          placeholder="Task title..."
          class="flex-1 p-3 border border-border rounded-lg bg-bg-input text-text-main placeholder-text-muted focus:border-primary focus:outline-none"
          (keyup.enter)="add()">
        
        <input 
          type="date" 
          [ngModel]="date()" 
          (ngModelChange)="date.set($event)"
          class="p-3 border border-border rounded-lg bg-bg-input text-text-main">

        <select 
          [ngModel]="type()" 
          (ngModelChange)="type.set($event)"
          class="p-3 border border-border rounded-lg bg-bg-input text-text-main">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button 
          (click)="add()"
          class="bg-primary text-text-inverse px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium">
          <i class="pi pi-plus mr-2"></i> Add
        </button>
      </div>

      <textarea 
        [ngModel]="description()" 
        (ngModelChange)="description.set($event)"
        placeholder="Description (optional)..."
        rows="2"
        class="w-full p-3 border border-border rounded-lg bg-bg-input text-text-main placeholder-text-muted focus:border-primary focus:outline-none resize-none"></textarea>
    </div>
  `
})
export class TasksQuickAddComponent {
  taskAdded = output<{ title: string; date: string; type: TaskType; description?: string }>();

  title = signal('');
  description = signal('');
  date = signal(new Date().toISOString().split('T')[0]);
  type = signal<TaskType>('daily');

  add() {
    if (!this.title().trim()) return;
    this.taskAdded.emit({
      title: this.title(),
      date: this.date(),
      type: this.type(),
      description: this.description() || undefined
    });
    this.title.set('');
    this.description.set('');
  }
}
