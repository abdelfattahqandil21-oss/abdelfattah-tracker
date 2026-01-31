import { Injectable, signal, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Task, TaskType } from '../../../shared/models/task.model';
import { sortByDate } from '../../../shared/utils/sort.utils';
import { generateId, findById, updateById, filterById, prependItem } from '../../../shared/utils/common.utils';

const STORE = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private localStorage = inject(LocalStorageService);
  tasks = signal<Task[]>([]);

  constructor() {
    this.initialize();
  }

  private initialize() {
    const all = this.localStorage.getAll<Task>(STORE);
    this.tasks.set(sortByDate(all));
  }

  addOrUpdate(task: Task) {
    const exists = findById(this.tasks(), task.id);
    if (exists) {
      this.localStorage.update(STORE, task);
      this.tasks.set(updateById(this.tasks(), task));
    } else {
      this.localStorage.add(STORE, task);
      this.tasks.set(prependItem(this.tasks(), task));
    }
  }

  delete(id: string) {
    this.localStorage.delete(STORE, id);
    this.tasks.set(filterById(this.tasks(), id));
  }

  createTask(title: string, date: string, type: TaskType, description?: string): Task {
    return {
      id: generateId(),
      title,
      date,
      type,
      status: 'init',
      description
    };
  }
}
