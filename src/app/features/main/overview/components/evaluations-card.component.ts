import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evaluations-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-48">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider">Evaluations</h3>
        <a routerLink="/evaluations" class="text-xs text-primary hover:underline">View All</a>
      </div>
      <div class="space-y-3 h-28 flex flex-col justify-center">
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-muted">Activity</span>
          <span class="font-bold text-text-main">{{ stats().activity }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-muted">Health</span>
          <span class="font-bold text-text-main">{{ stats().health }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-muted">Productivity</span>
          <span class="font-bold text-text-main">{{ stats().productivity }}</span>
        </div>
      </div>
    </div>
  `
})
export class EvaluationsCardComponent {
  stats = input.required<{ activity: string; health: string; productivity: string }>();
}
