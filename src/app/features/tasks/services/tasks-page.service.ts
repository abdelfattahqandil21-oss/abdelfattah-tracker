import { Injectable, inject, computed, signal } from '@angular/core';
import { TasksService } from './tasks.service';
import { Task, TaskType, TaskStatus } from '../../../shared/models/task.model';

export interface TaskStats {
   total: number;
   done: number;
   pending: number;
   completionRate: number;
}

export type FilterType = 'today' | 'week' | 'month' | 'all';

@Injectable({ providedIn: 'root' })
export class TasksPageService {
   private tasksService = inject(TasksService);

   // Filter state
   activeFilter = signal<FilterType>('today');
   activeType = signal<TaskType | 'all'>('daily');

   // Get today's date
   private today = new Date().toISOString().split('T')[0];

   // Filtered tasks based on active filters
   filteredTasks = computed(() => {
      let tasks = this.tasksService.tasks();
      const filter = this.activeFilter();
      const type = this.activeType();

      // Filter by date range
      if (filter === 'today') {
         tasks = tasks.filter(t => t.date === this.today);
      } else if (filter === 'week') {
         const weekStart = this.getWeekStart();
         const weekEnd = this.getWeekEnd();
         tasks = tasks.filter(t => t.date >= weekStart && t.date <= weekEnd);
      } else if (filter === 'month') {
         const monthStart = this.getMonthStart();
         const monthEnd = this.getMonthEnd();
         tasks = tasks.filter(t => t.date >= monthStart && t.date <= monthEnd);
      }

      // Filter by type
      if (type !== 'all') {
         tasks = tasks.filter(t => t.type === type);
      }

      // Sort by date (newest first) and status (pending first)
      return tasks.sort((a, b) => {
         if (a.status === 'done' && b.status !== 'done') return 1;
         if (a.status !== 'done' && b.status === 'done') return -1;
         return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
   });

   // Stats for current filter
   stats = computed<TaskStats>(() => {
      const tasks = this.filteredTasks();
      const total = tasks.length;
      const done = tasks.filter(t => t.status === 'done').length;
      const pending = total - done;
      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
      return { total, done, pending, completionRate };
   });

   // Group tasks by date
   groupedByDate = computed(() => {
      const tasks = this.filteredTasks();
      const groups = new Map<string, Task[]>();

      tasks.forEach(task => {
         const existing = groups.get(task.date) || [];
         groups.set(task.date, [...existing, task]);
      });

      return Array.from(groups.entries()).map(([date, tasks]) => ({
         date,
         dateFormatted: this.formatDate(date),
         tasks,
         done: tasks.filter(t => t.status === 'done').length,
         total: tasks.length
      }));
   });

   // Kanban boards - group by type then by status
   kanbanBoards = computed(() => {
      const tasks = this.filteredTasks();
      const types: TaskType[] = ['daily', 'weekly', 'monthly'];
      const statuses: TaskStatus[] = ['init', 'progress', 'done'];
      const statusLabels: Record<TaskStatus, string> = {
         init: 'To Do',
         progress: 'In Progress',
         done: 'Done'
      };
      const typeLabels: Record<TaskType, string> = {
         daily: 'Daily',
         weekly: 'Weekly',
         monthly: 'Monthly'
      };

      return types.map(type => ({
         type,
         label: typeLabels[type],
         columns: statuses.map(status => ({
            status,
            label: statusLabels[status],
            tasks: tasks.filter(t => t.type === type && t.status === status)
         }))
      })).filter(board => board.columns.some(col => col.tasks.length > 0) || this.activeType() === board.type || this.activeType() === 'all');
   });

   // Helper methods
   private getWeekStart(): string {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      return d.toISOString().split('T')[0];
   }

   private getWeekEnd(): string {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? 0 : 7);
      d.setDate(diff);
      return d.toISOString().split('T')[0];
   }

   private getMonthStart(): string {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
   }

   private getMonthEnd(): string {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
   }

   private formatDate(dateStr: string): string {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
   }

   // Actions
   setFilter(filter: FilterType) {
      this.activeFilter.set(filter);
   }

   setType(type: TaskType | 'all') {
      this.activeType.set(type);
   }

   toggleStatus(task: Task) {
      const newStatus: TaskStatus = task.status === 'done' ? 'init' : 'done';
      this.tasksService.addOrUpdate({ ...task, status: newStatus });
   }

   updateTaskStatus(task: Task, newStatus: TaskStatus) {
      this.tasksService.addOrUpdate({ ...task, status: newStatus });
   }

   deleteTask(id: string) {
      this.tasksService.delete(id);
   }

   addTask(title: string, date: string, type: TaskType, description?: string) {
      if (!title.trim()) return;
      const task = this.tasksService.createTask(title, date, type, description);
      this.tasksService.addOrUpdate(task);
   }
}
