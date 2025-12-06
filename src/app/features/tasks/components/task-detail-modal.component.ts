import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Task, TaskType, TaskStatus } from '../../../shared/models/task.model';

@Component({
   selector: 'app-task-detail-modal',
   standalone: true,
   imports: [CommonModule, FormsModule, ModalComponent],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <app-modal 
      [isOpen]="!!task()" 
      [title]="task()?.title || 'Task Details'"
      [showFooter]="true"
      (close)="closed.emit()">
      
      @if (task(); as t) {
        <div class="space-y-4">
          <!-- Status -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-text-muted w-24">Status:</span>
            <span class="px-3 py-1 rounded-full text-sm font-medium"
              [class.bg-primary]="t.status === 'done'"
              [class.text-text-inverse]="t.status === 'done'"
              [class.bg-warning]="t.status === 'progress'"
              [class.text-text-main]="t.status === 'progress'"
              [class.bg-bg-app]="t.status === 'init'"
              [class.text-text-muted]="t.status === 'init'">
              {{ t.status === 'done' ? '✓ Completed' : t.status === 'progress' ? '⏳ In Progress' : '○ Pending' }}
            </span>
          </div>

          <!-- Type -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-text-muted w-24">Type:</span>
            <span class="px-3 py-1 rounded text-sm font-medium capitalize"
              [class.bg-bg-app]="t.type === 'daily'"
              [class.text-primary]="t.type === 'daily'"
              [class.bg-warning]="t.type === 'weekly'"
              [class.text-text-main]="t.type === 'weekly'"
              [class.bg-error]="t.type === 'monthly'"
              [class.text-text-inverse]="t.type === 'monthly'">
              {{ t.type }}
            </span>
          </div>

          <!-- Date -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-text-muted w-24">Date:</span>
            <span class="text-text-main font-medium">{{ t.date | date:'fullDate' }}</span>
          </div>

          <!-- Description -->
          <div>
            <span class="text-sm text-text-muted block mb-2">Description:</span>
            @if (t.description) {
              <p class="text-text-main bg-bg-app p-3 rounded-lg">{{ t.description }}</p>
            } @else {
              <p class="text-text-muted italic">No description</p>
            }
          </div>
        </div>
      }

      <!-- Footer -->
      <div modal-footer class="flex gap-2">
        <button 
          (click)="toggleStatus()"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          [class.bg-primary]="task()?.status !== 'done'"
          [class.text-text-inverse]="task()?.status !== 'done'"
          [class.bg-bg-app]="task()?.status === 'done'"
          [class.text-text-main]="task()?.status === 'done'">
          {{ task()?.status === 'done' ? 'Mark as Pending' : 'Mark as Done' }}
        </button>
        <button 
          (click)="deleteClicked()"
          class="px-4 py-2 rounded-lg bg-error text-text-inverse font-medium hover:opacity-90 transition-opacity">
          <i class="pi pi-trash mr-2"></i> Delete
        </button>
      </div>
    </app-modal>
  `
})
export class TaskDetailModalComponent {
   task = input<Task | null>(null);
   closed = output<void>();
   toggle = output<Task>();
   delete = output<string>();

   toggleStatus() {
      const t = this.task();
      if (t) {
         this.toggle.emit(t);
      }
   }

   deleteClicked() {
      const t = this.task();
      if (t && confirm('Delete this task?')) {
         this.delete.emit(t.id);
         this.closed.emit();
      }
   }
}
