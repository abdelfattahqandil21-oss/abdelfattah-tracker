import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-pomodoro-stats-summary',
  standalone: true,
  template: `
    <div class="bg-bg-card rounded-xl border border-border shadow-sm p-4 space-y-2">
      <h3 class="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Today</h3>
      <div class="flex items-center justify-between text-sm">
        <span class="text-text-muted">Focus Sessions</span>
        <span class="font-semibold">{{ focusSessions() }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-text-muted">Total Focus Minutes</span>
        <span class="font-semibold">{{ totalFocusMinutes() }}</span>
      </div>
      <div class="flex items-center justify-between text-xs pt-1 border-t border-border/40 mt-2">
        <span class="text-text-muted">All Sessions</span>
        <span class="font-medium">{{ totalSessions() }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsSummaryComponent {
  focusSessions = input<number>(0);
  totalFocusMinutes = input<number>(0);
  totalSessions = input<number>(0);
}
