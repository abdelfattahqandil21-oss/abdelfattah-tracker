import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationsService } from './services/evaluations.service';
import { EvaluationType } from '../../shared/models/evaluation.model';
import { HeaderComponent } from '../main/header/header.component';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationsComponent {
  private service = inject(EvaluationsService);
  evaluations = this.service.evaluations;

  newDate = signal(new Date().toISOString().split('T')[0]);
  newType = signal<EvaluationType>('productivity');
  newScore = signal(5);
  newNotes = signal('');

  filteredEvaluations = computed(() => {
    return this.evaluations().filter(e => e.date === this.newDate());
  });

  addEvaluation() {
    const evaluation = this.service.createEvaluation(
      this.newDate(),
      this.newType(),
      this.newScore(),
      this.newNotes()
    );

    this.service.addOrUpdate(evaluation);
    this.newNotes.set('');
    this.newScore.set(5);
  }

  deleteEvaluation(id: string) {
    if (confirm('Are you sure?')) {
      this.service.delete(id);
    }
  }

  getScoreColor(score: number): string {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  }
}
