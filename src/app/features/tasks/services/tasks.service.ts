import { Injectable, signal, inject, computed } from '@angular/core';
import { IDBService } from '../../../core/services/idb.service';
import { Task, TaskType, TaskStatus } from '../../../shared/models/task.model';

const DB = 'venofy-tracker-db';
const STORE = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private idb = inject(IDBService);
  tasks = signal<Task[]>([]);
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      await this.idb.open(DB, STORE);
      const all = await this.idb.getAll<Task>(STORE);
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
        await this.idb.update(STORE, task);
        this.tasks.update(list => list.map(t => t.id === task.id ? task : t));
      } else {
        await this.idb.add(STORE, task);
        this.tasks.update(list => [task, ...list]);
      }
    } catch (error) {
      console.error('[TasksService] Error saving task:', error);
      throw error;
    }
  }

  async delete(id: string) {
    if (!this.isInitialized) await this.initialize();
    await this.idb.delete(STORE, id);
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
