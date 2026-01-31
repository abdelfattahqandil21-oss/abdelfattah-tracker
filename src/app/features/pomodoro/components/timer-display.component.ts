import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-pomodoro-timer-display',
  standalone: true,
  template: `
    <div class="bg-bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center">
      <p class="text-xs uppercase tracking-[0.3em] text-text-muted mb-2">Pomodoro</p>
      <h2 class="font-display text-5xl sm:text-6xl font-bold text-primary mb-2 cursor-pointer select-none"
        (click)="timeClick.emit()">
        {{ time() }}
      </h2>
      <p class="text-xs text-text-muted">{{ label() }}</p>
      <div class="w-full mt-4 h-2 bg-bg-app rounded-full overflow-hidden">
        <div class="h-full bg-primary transition-all duration-300" [style.width.%]="progress() * 100"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerDisplayComponent {
  time = input<string>('25:00');
  label = input<string>('Focus Session');
  progress = input<number>(0);
  timeClick = output<void>();
}
