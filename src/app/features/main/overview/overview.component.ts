import { Component, ChangeDetectionStrategy, inject, computed, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SugarService } from '../../sugar-tracker/services/sugar.service';
import { TasksService } from '../../tasks/services/tasks.service';
import { EvaluationsService } from '../../evaluations/services/evaluations.service';
import { NotesService } from '../../notes/services/notes.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements AfterViewInit {
  private sugarService = inject(SugarService);
  private tasksService = inject(TasksService);
  private evaluationsService = inject(EvaluationsService);
  private notesService = inject(NotesService);

  @ViewChild('sugarChart') sugarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tasksChart') tasksChartRef!: ElementRef<HTMLCanvasElement>;

  private sugarChart: Chart | undefined;
  private tasksChart: Chart | undefined;

  constructor() {
    // Effect to update charts when signals change
    effect(() => {
      this.updateSugarChart();
      this.updateTasksChart();
    });
  }

  ngAfterViewInit() {
    this.initSugarChart();
    this.initTasksChart();
  }

  // Sugar Analytics
  sugarStats = computed(() => {
    const entries = this.sugarService.entries();
    if (entries.length === 0) return { avg: 0, last: 0, count: 0 };

    const last = entries[0].value || 0;
    const validEntries = entries.filter(e => e.value !== null);
    const avg = validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + (curr.value || 0), 0) / validEntries.length
      : 0;

    return {
      avg: Math.round(avg),
      last: last,
      count: entries.length
    };
  });

  // Tasks Analytics
  taskStats = computed(() => {
    const tasks = this.tasksService.tasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  });

  // Evaluations Analytics
  evalStats = computed(() => {
    const evals = this.evaluationsService.evaluations();
    if (evals.length === 0) return { activity: 0, health: 0, productivity: 0, avg: 0 };

    const getAvg = (type: string) => {
      const typeEvals = evals.filter(e => e.type === type);
      return typeEvals.length > 0
        ? (typeEvals.reduce((acc, curr) => acc + curr.score, 0) / typeEvals.length).toFixed(1)
        : '0.0';
    };

    return {
      activity: getAvg('activity'),
      health: getAvg('health'),
      productivity: getAvg('productivity'),
      avg: (evals.reduce((acc, curr) => acc + curr.score, 0) / evals.length).toFixed(1)
    };
  });

  // Notes Analytics
  noteStats = computed(() => {
    return { count: this.notesService.notes().length };
  });

  private initSugarChart() {
    if (!this.sugarChartRef) return;

    const ctx = this.sugarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Sugar Level',
          data: [],
          borderColor: '#514e47', // Primary Color
          backgroundColor: 'rgba(81, 78, 71, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 600,
            title: {
              display: true,
              text: 'mg/dL'
            }
          }
        }
      }
    };

    this.sugarChart = new Chart(ctx, config);
    this.updateSugarChart();
  }

  private updateSugarChart() {
    if (!this.sugarChart) return;

    const entries = this.sugarService.entries()
      .slice(0, 14) // Last 14 entries
      .reverse(); // Chronological order

    this.sugarChart.data.labels = entries.map(e => new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    this.sugarChart.data.datasets[0].data = entries.map(e => e.value || 0);
    this.sugarChart.update();
  }

  private initTasksChart() {
    if (!this.tasksChartRef) return;

    const ctx = this.tasksChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Done', 'Pending'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#514e47', '#99948d'], // Primary, Muted
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '70%'
      }
    };

    this.tasksChart = new Chart(ctx, config);
    this.updateTasksChart();
  }

  private updateTasksChart() {
    if (!this.tasksChart) return;

    const stats = this.taskStats();
    this.tasksChart.data.datasets[0].data = [stats.completed, stats.pending];
    this.tasksChart.update();
  }
}
