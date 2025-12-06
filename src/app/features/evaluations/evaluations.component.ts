import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { EvaluationsPageService, FilterPeriod } from './services/evaluations-page.service';
import { EvaluationType } from '../../shared/models/evaluation.model';
import { HeaderComponent } from '../main/header/header.component';
import { EvalStatsCardsComponent } from './components/eval-stats-cards.component';
import { EvalQuickAddComponent } from './components/eval-quick-add.component';
import { EvalHistoryTableComponent } from './components/eval-history-table.component';
import { EvalFilterBarComponent } from './components/eval-filter-bar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [
    HeaderComponent,
    EvalStatsCardsComponent,
    EvalQuickAddComponent,
    EvalHistoryTableComponent,
    EvalFilterBarComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationsComponent implements OnInit {
  protected service = inject(EvaluationsPageService);
  isLoading = signal(true);

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 600);
  }

  onDateChange(date: string) {
    this.service.setDate(date);
  }

  onPeriodChange(period: FilterPeriod) {
    this.service.setPeriod(period);
  }

  onEvalAdded(event: { type: EvaluationType; score: number }) {
    this.service.addEvaluation(event.type, event.score);
  }

  onScoreChanged(event: { date: string; type: EvaluationType; score: number }) {
    this.service.updateEvaluationScore(event.date, event.type, event.score);
  }

  onNextWeek() {
    this.service.nextWeek();
  }

  onPrevWeek() {
    this.service.prevWeek();
  }
}
