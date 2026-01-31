import { Injectable, signal, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Evaluation, EvaluationType } from '../../../shared/models/evaluation.model';

const STORE = 'evaluations';

@Injectable({ providedIn: 'root' })
export class EvaluationsService {
  private localStorage = inject(LocalStorageService);
  evaluations = signal<Evaluation[]>([]);
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      const all = this.localStorage.getAll<Evaluation>(STORE);
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
        this.localStorage.update(STORE, evaluation);
        this.evaluations.update(list => list.map(e => e.id === evaluation.id ? evaluation : e));
      } else {
        this.localStorage.add(STORE, evaluation);
        this.evaluations.update(list => [evaluation, ...list]);
      }
    } catch (error) {
      console.error('[EvaluationsService] Error saving evaluation:', error);
      throw error;
    }
  }

  async delete(id: string) {
    if (!this.isInitialized) await this.initialize();
    this.localStorage.delete(STORE, id);
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
