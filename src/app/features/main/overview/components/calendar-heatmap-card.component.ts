import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../services/overview.service';

@Component({
  selector: 'app-calendar-heatmap-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-72">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider">30-Day Heatmap</h3>
        <div class="flex gap-2 text-xs">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-green-400"></span>Good</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-yellow-400"></span>Warning</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-red-400"></span>High</span>
        </div>
      </div>
      <div class="grid grid-cols-10 gap-1">
        @for (day of days(); track day.date) {
          <div class="aspect-square rounded flex items-center justify-center text-xs font-medium cursor-default"
            [class.bg-gray-100]="day.level === 'none'"
            [class.text-gray-400]="day.level === 'none'"
            [class.bg-green-200]="day.level === 'good'"
            [class.text-green-800]="day.level === 'good'"
            [class.bg-yellow-200]="day.level === 'warning' || day.level === 'low'"
            [class.text-yellow-800]="day.level === 'warning' || day.level === 'low'"
            [class.bg-red-200]="day.level === 'high'"
            [class.text-red-800]="day.level === 'high'"
            [title]="day.date + (day.avg ? ': ' + day.avg + ' mg/dL' : ': No data')">
            {{ day.dayNum }}
          </div>
        }
      </div>
    </div>
  `
})
export class CalendarHeatmapCardComponent {
  days = input.required<CalendarDay[]>();
}
