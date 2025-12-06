import { Injectable, signal, inject } from '@angular/core';
import { IDBService } from '../../../core/services/idb.service';
import { Evaluation, EvaluationType } from '../../../shared/models/evaluation.model';

const DB = 'venofy-tracker-db';
const STORE = 'evaluations';

@Injectable({ providedIn: 'root' })
export class EvaluationsService {
  private idb = inject(IDBService);
  evaluations = signal<Evaluation[]>([]);
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      await this.idb.open(DB, STORE);
      const all = await this.idb.getAll<Evaluation>(STORE);
      this.evaluations.set(all.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      this.isInitialized = true;
    } catch (error) {
      console.error('[EvaluationsService] Initialization error:', error);
    }
  }

  async addOrUpdate(evaluation: Evaluation) {
    if (!this.isInitialized) await this.initialize();

    try {
      const exists = this.evaluations().some(e => e.id === evaluation.id);
      if (exists) {
        await this.idb.update(STORE, evaluation);
        this.evaluations.update(list => list.map(e => e.id === evaluation.id ? evaluation : e));
      } else {
        await this.idb.add(STORE, evaluation);
        this.evaluations.update(list => [evaluation, ...list]);
      }
    } catch (error) {
      console.error('[EvaluationsService] Error saving evaluation:', error);
      throw error;
    }
  }

  async delete(id: string) {
    if (!this.isInitialized) await this.initialize();
    await this.idb.delete(STORE, id);
    this.evaluations.update(list => list.filter(e => e.id !== id));
  }

  createEvaluation(date: string, type: EvaluationType, score: number, notes?: string): Evaluation {
    return {
      id: crypto.randomUUID(),
      date,
      type,
      score,
      notes
    };
  }
}
