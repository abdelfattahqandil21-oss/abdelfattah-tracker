import { Injectable, signal, inject, computed } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SugarEntry, Meal, Timing } from '../../../shared/models/sugar-entry.model';
import { sortByDate } from '../../../shared/utils/sort.utils';
import { generateId, findById, updateById, filterById, prependItem } from '../../../shared/utils/common.utils';

const STORE = 'sugar-entries';

@Injectable({ providedIn: 'root' })
export class SugarService {
  private localStorage = inject(LocalStorageService);
  private _entries = signal<SugarEntry[]>([]);

  constructor() {
    this.initialize();
  }

  get entries() {
    return this._entries.asReadonly();
  }

  set entriesData(data: SugarEntry[]) {
    this._entries.set(data);
  }

  private initialize() {
    const all = this.localStorage.getAll<SugarEntry>(STORE);
    this.entriesData = sortByDate(all);
  }

  addOrUpdate(entry: SugarEntry) {
    const exists = findById(this._entries(), entry.id);
    if (exists) {
      this.localStorage.update(STORE, entry);
      this._entries.set(updateById(this._entries(), entry));
    } else {
      this.localStorage.add(STORE, entry);
      this._entries.set(prependItem(this._entries(), entry));
    }
  }

  remove(id: string) {
    this.localStorage.delete(STORE, id);
    this._entries.set(filterById(this._entries(), id));
  }

  getLast14Days(): SugarEntry[] {
    const today = new Date();
    return this._entries().filter(e => {
      const entryDate = new Date(e.date);
      const diff = (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 14;
    });
  }

  createEntry(date: string, meal: Meal, timing: Timing): SugarEntry {
    return {
      id: generateId(),
      date,
      meal,
      timing,
      value: null,
      note: ''
    };
  }
}
