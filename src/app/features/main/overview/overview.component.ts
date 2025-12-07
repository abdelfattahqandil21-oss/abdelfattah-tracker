import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { OverviewService } from './services/overview.service';
import { AlertsCardComponent } from './components/alerts-card.component';
import { QuickActionsCardComponent } from './components/quick-actions-card.component';
import { TodaySummaryCardComponent } from './components/today-summary-card.component';
import { TrendsCardComponent } from './components/trends-card.component';
import { SugarChartCardComponent } from './components/sugar-chart-card.component';
import { AvgChartCardComponent } from './components/avg-chart-card.component';
import { CalendarHeatmapCardComponent } from './components/calendar-heatmap-card.component';
import { TasksChartCardComponent } from './components/tasks-chart-card.component';
import { EvaluationsCardComponent } from './components/evaluations-card.component';
import { NotesPreviewCardComponent } from './components/notes-preview-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    AlertsCardComponent,
    QuickActionsCardComponent,
    TodaySummaryCardComponent,
    TrendsCardComponent,
    SugarChartCardComponent,
    AvgChartCardComponent,
    CalendarHeatmapCardComponent,
    TasksChartCardComponent,
    EvaluationsCardComponent,
    NotesPreviewCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit {
  protected service = inject(OverviewService);
  isLoading = signal(true);

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 800);
  }
}
