import { Component, ChangeDetectionStrategy, input, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartData } from '../services/overview.service';

Chart.register(...registerables);

@Component({
   selector: 'app-sugar-chart-card',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider">Sugar Levels - 14 Days</h3>
        <div class="text-xs text-text-muted">
          <span class="font-bold text-text-main">{{ avg() }}</span> avg | 
          <span class="font-bold text-text-main">{{ last() }}</span> last
        </div>
      </div>
      <div class="h-[50vh] relative">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `
})
export class SugarChartCardComponent implements AfterViewInit {
   data = input.required<ChartData>();
   avg = input<number>(0);
   last = input<number>(0);

   @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
   private chart: Chart | undefined;

   constructor() {
      effect(() => {
         const d = this.data();
         if (this.chart && d) {
            this.updateChart(d);
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

      const d = this.data();
      const config: ChartConfiguration = {
         type: 'line',
         data: {
            labels: d.labels,
            datasets: [
               { label: 'Breakfast Before', data: d.breakfastBefore, borderColor: '#FF6B6B', backgroundColor: '#FF6B6B', tension: 0.3, pointRadius: 5, spanGaps: true },
               { label: 'Breakfast After', data: d.breakfastAfter, borderColor: '#FF8E8E', backgroundColor: '#FF8E8E', tension: 0.3, pointRadius: 5, borderDash: [5, 5], spanGaps: true },
               { label: 'Lunch Before', data: d.lunchBefore, borderColor: '#4ECDC4', backgroundColor: '#4ECDC4', tension: 0.3, pointRadius: 5, spanGaps: true },
               { label: 'Lunch After', data: d.lunchAfter, borderColor: '#7EDDD6', backgroundColor: '#7EDDD6', tension: 0.3, pointRadius: 5, borderDash: [5, 5], spanGaps: true },
               { label: 'Dinner Before', data: d.dinnerBefore, borderColor: '#9B59B6', backgroundColor: '#9B59B6', tension: 0.3, pointRadius: 5, spanGaps: true },
               { label: 'Dinner After', data: d.dinnerAfter, borderColor: '#B97FCC', backgroundColor: '#B97FCC', tension: 0.3, pointRadius: 5, borderDash: [5, 5], spanGaps: true },
               { label: 'Daily Average', data: d.dailyAvg, borderColor: '#514e47', backgroundColor: 'rgba(81,78,71,0.15)', tension: 0.3, pointRadius: 7, borderWidth: 3, fill: true, spanGaps: true }
            ]
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
               legend: { display: true, position: 'top', labels: { usePointStyle: true, padding: 10, font: { size: 10 } } },
               tooltip: { callbacks: { label: (ctx) => ctx.parsed.y !== null ? `${ctx.dataset.label}: ${ctx.parsed.y} mg/dL` : '' } }
            },
            scales: {
               y: { beginAtZero: true, suggestedMax: 400, title: { display: true, text: 'mg/dL' }, grid: { color: 'rgba(0,0,0,0.05)' } },
               x: { grid: { display: false } }
            }
         }
      };
      this.chart = new Chart(ctx, config);
   }

   private updateChart(d: ChartData) {
      if (!this.chart) return;
      this.chart.data.labels = d.labels;
      this.chart.data.datasets[0].data = d.breakfastBefore;
      this.chart.data.datasets[1].data = d.breakfastAfter;
      this.chart.data.datasets[2].data = d.lunchBefore;
      this.chart.data.datasets[3].data = d.lunchAfter;
      this.chart.data.datasets[4].data = d.dinnerBefore;
      this.chart.data.datasets[5].data = d.dinnerAfter;
      this.chart.data.datasets[6].data = d.dailyAvg;
      this.chart.update();
   }
}
