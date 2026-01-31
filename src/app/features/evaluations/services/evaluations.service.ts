import { Injectable, signal, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Evaluation, EvaluationType } from '../../../shared/models/evaluation.model';
import { sortByDate } from '../../../shared/utils/sort.utils';
import { generateId, findById, updateById, filterById, prependItem } from '../../../shared/utils/common.utils';

const STORE = 'evaluations';

@Injectable({ providedIn: 'root' })
export class EvaluationsService {
  private localStorage = inject(LocalStorageService);
  evaluations = signal<Evaluation[]>([]);

  constructor() {
    this.initialize();
  }

  private initialize() {
    const all = this.localStorage.getAll<Evaluation>(STORE);
    this.evaluations.set(sortByDate(all));
  }

  addOrUpdate(evaluation: Evaluation) {
    const exists = findById(this.evaluations(), evaluation.id);
    if (exists) {
      this.localStorage.update(STORE, evaluation);
      this.evaluations.set(updateById(this.evaluations(), evaluation));
    } else {
      this.localStorage.add(STORE, evaluation);
      this.evaluations.set(prependItem(this.evaluations(), evaluation));
    }
  }

  delete(id: string) {
    this.localStorage.delete(STORE, id);
    this.evaluations.set(filterById(this.evaluations(), id));
  }

  createEvaluation(date: string, type: EvaluationType, score: number, notes?: string): Evaluation {
    return {
      id: generateId(),
      date,
      type,
      score,
      notes
    };
  }
}
