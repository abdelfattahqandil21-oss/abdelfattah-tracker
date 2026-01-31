import { Injectable, signal, inject, computed } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Task, TaskType, TaskStatus } from '../../../shared/models/task.model';

const STORE = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private localStorage = inject(LocalStorageService);
  tasks = signal<Task[]>([]);
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      const all = this.localStorage.getAll<Task>(STORE);
      this.tasks.set(all.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      this.isInitialized = true;
    } catch (error) {
      console.error('[TasksService] Initialization error:', error);
    }
  }

  async addOrUpdate(task: Task) {
    if (!this.isInitialized) await this.initialize();

    try {
      const exists = this.tasks().some(t => t.id === task.id);
      if (exists) {
        this.localStorage.update(STORE, task);
        this.tasks.update(list => list.map(t => t.id === task.id ? task : t));
      } else {
        this.localStorage.add(STORE, task);
        this.tasks.update(list => [task, ...list]);
      }
    } catch (error) {
      console.error('[TasksService] Error saving task:', error);
      throw error;
    }
  }

  async delete(id: string) {
    if (!this.isInitialized) await this.initialize();
    this.localStorage.delete(STORE, id);
    this.tasks.update(list => list.filter(t => t.id !== id));
  }

  createTask(title: string, date: string, type: TaskType, description?: string): Task {
    return {
      id: crypto.randomUUID(),
      title,
      date,
      type,
      status: 'init',
      description
    };
  }
}
