import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-pomodoro-timer-controls',
  standalone: true,
  template: `
    <div class="flex items-center justify-center gap-4 mt-3">
      <button type="button" (click)="onStart.emit()"
        class="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold tracking-wide shadow-sm hover:bg-primary-dark transition-colors">
        {{ isRunning() ? 'Resume' : 'Start' }}
      </button>
      <button type="button" (click)="onPause.emit()"
        class="px-4 py-2 rounded-full border border-border text-sm font-semibold tracking-wide text-text-main hover:bg-bg-app transition-colors">
        Pause
      </button>
      <button type="button" (click)="onReset.emit()"
        class="px-3 py-2 rounded-full border border-border text-xs font-semibold tracking-wide text-text-muted hover:text-text-main hover:bg-bg-app transition-colors">
        Reset
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerControlsComponent {
  isRunning = input<boolean>(false);
  onStart = output<void>();
  onPause = output<void>();
  onReset = output<void>();
}
