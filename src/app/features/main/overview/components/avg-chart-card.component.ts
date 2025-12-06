import { Component, ChangeDetectionStrategy, input, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartData } from '../services/overview.service';

Chart.register(...registerables);

@Component({
   selector: 'app-avg-chart-card',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-72">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider">Daily Average</h3>
        <div class="flex gap-2 text-xs">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-green-500"></span>Good</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-yellow-500"></span>Low</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-red-500"></span>High</span>
        </div>
      </div>
      <div class="h-[25vh] relative">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `
})
export class AvgChartCardComponent implements AfterViewInit {
   data = input.required<ChartData>();

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

   private getColors(values: (number | null)[]) {
      return values.map(v => !v ? 'rgba(153,148,141,0.5)' : v < 70 ? 'rgba(241,196,15,0.8)' : v > 180 ? 'rgba(231,76,60,0.8)' : 'rgba(46,204,113,0.8)');
   }

   private initChart() {
      if (!this.chartRef?.nativeElement) return;
      const ctx = this.chartRef.nativeElement.getContext('2d');
      if (!ctx) return;

      const d = this.data();
      const config: ChartConfiguration = {
         type: 'bar',
         data: {
            labels: d.labels,
            datasets: [{
               label: 'Daily Average',
               data: d.dailyAvg,
               backgroundColor: this.getColors(d.dailyAvg),
               borderColor: d.dailyAvg.map(v => !v ? '#99948d' : v < 70 ? '#f1c40f' : v > 180 ? '#e74c3c' : '#2ecc71'),
               borderWidth: 2,
               borderRadius: 6
            }]
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
               legend: { display: false },
               tooltip: { backgroundColor: '#514e47', padding: 10, callbacks: { label: (ctx) => !ctx.parsed.y ? 'No data' : `${ctx.parsed.y} mg/dL` } }
            },
            scales: {
               y: { beginAtZero: true, suggestedMax: 300, title: { display: true, text: 'mg/dL' }, grid: { color: 'rgba(0,0,0,0.08)' } },
               x: { grid: { display: false }, ticks: { font: { size: 9 } } }
            }
         }
      };
      this.chart = new Chart(ctx, config);
   }

   private updateChart(d: ChartData) {
      if (!this.chart) return;
      this.chart.data.labels = d.labels;
      this.chart.data.datasets[0].data = d.dailyAvg;
      (this.chart.data.datasets[0] as any).backgroundColor = this.getColors(d.dailyAvg);
      this.chart.update();
   }
}
