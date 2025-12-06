import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trends } from '../services/overview.service';

@Component({
  selector: 'app-trends-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-48">
      <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider mb-4">Weekly Trends</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-text-muted text-sm">This Week Avg</span>
          <div class="flex items-center gap-2">
            <span class="font-bold text-text-main">{{ trends().thisWeekAvg }}</span>
            @if (trends().trend === 'up') {
              <i class="pi pi-arrow-up text-red-500 text-xs"></i>
            } @else if (trends().trend === 'down') {
              <i class="pi pi-arrow-down text-green-500 text-xs"></i>
            } @else {
              <i class="pi pi-minus text-gray-400 text-xs"></i>
            }
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-text-muted text-sm">Last Week Avg</span>
          <span class="font-bold text-text-main">{{ trends().lastWeekAvg }}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-text-muted">Highest / Lowest</span>
          <span>
            <span class="text-red-500 font-bold">{{ trends().highest }}</span> / 
            <span class="text-green-500 font-bold">{{ trends().lowest }}</span>
          </span>
        </div>
      </div>
    </div>
  `
})
export class TrendsCardComponent {
  trends = input.required<Trends>();
}
