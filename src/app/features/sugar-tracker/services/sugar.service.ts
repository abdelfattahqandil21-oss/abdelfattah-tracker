import { Injectable, signal, inject, computed } from '@angular/core';
import { IDBService } from '../../../core/services/idb.service';
import { SugarEntry, Meal, Timing } from '../../../shared/models/sugar-entry.model';

const DB = 'sugar-tracker-db';
const STORE = 'sugar-entries';

@Injectable({ providedIn: 'root' })
export class SugarService {
  private idb = inject(IDBService);
  private _entries = signal<SugarEntry[]>([]);
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  // Getter for entries signal
  get entries() {
    return this._entries.asReadonly();
  }

  // Setter for entries (updates the signal)
  set entriesData(data: SugarEntry[]) {
    this._entries.set(data);
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('[SugarService] Initializing database...');
      await this.idb.open(DB, STORE);
      console.log('[SugarService] Database opened successfully');

      const all = await this.idb.getAll<SugarEntry>(STORE);
      console.log(`[SugarService] Loaded ${all.length} entries`);

      this.entriesData = all.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      this.isInitialized = true;
      console.log('[SugarService] Initialization complete');
    } catch (error) {
      console.error('[SugarService] Initialization error:', error);
      throw error;
    }
  }

  async addOrUpdate(entry: SugarEntry) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const currentEntries = this._entries();
      const exists = currentEntries.some(e => e.id === entry.id);

      if (exists) {
        console.log('[SugarService] Updating existing entry:', entry);
        await this.idb.update(STORE, entry);
        this._entries.update(list =>
          list.map(e => e.id === entry.id ? entry : e)
        );
      } else {
        console.log('[SugarService] Adding new entry:', entry);
        await this.idb.add(STORE, entry);
        this._entries.update(list => [entry, ...list]);
      }

      return true;
    } catch (error) {
      console.error('[SugarService] Error in addOrUpdate:', error);
      throw error;
    }
  }

  async remove(id: string) {
    await this.idb.delete(STORE, id);
    this._entries.update(list => list.filter(e => e.id !== id));
  }

  async getLast14Days(): Promise<SugarEntry[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const today = new Date();
    return this._entries().filter(e => {
      const entryDate = new Date(e.date);
      const diff = (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 14;
    });
  }

  createEntry(date: string, meal: Meal, timing: Timing): SugarEntry {
    return {
      id: crypto.randomUUID(),
      date,
      meal,
      timing,
      value: null,
      note: ''
    };
  }
}
