import { Component, ChangeDetectionStrategy, input, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
   selector: 'app-tasks-chart-card',
   standalone: true,
   imports: [CommonModule, RouterLink],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-48">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider">Tasks</h3>
        <a routerLink="/tasks" class="text-xs text-primary hover:underline">View All</a>
      </div>
      <div class="h-28 relative flex items-center justify-center">
        <canvas #chartCanvas></canvas>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-xl font-bold text-text-main">{{ completionRate() }}%</span>
        </div>
      </div>
    </div>
  `
})
export class TasksChartCardComponent implements AfterViewInit {
   completed = input<number>(0);
   pending = input<number>(0);
   completionRate = input<number>(0);

   @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
   private chart: any;

   constructor() {
      effect(() => {
         const c = this.completed();
         const p = this.pending();
         if (this.chart) {
            this.chart.data.datasets[0].data = [c, p];
            this.chart.update();
         }
      });
   }

   ngAfterViewInit() {
      setTimeout(() => this.initChart(), 100);
   }

   private initChart() {
      if (!this.chartRef?.nativeElement) return;
      const ctx = this.chartRef.nativeElement.getContext('2d');
      if (!ctx) return;

      const config: ChartConfiguration<'doughnut'> = {
         type: 'doughnut',
         data: {
            labels: ['Done', 'Pending'],
            datasets: [{ data: [this.completed(), this.pending()], backgroundColor: ['#514e47', '#99948d'], borderWidth: 0 }]
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } },
            cutout: '70%'
         }
      };
      this.chart = new Chart(ctx, config);
   }
}
