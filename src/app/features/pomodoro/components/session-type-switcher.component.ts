import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { PomodoroSessionType } from '../models/pomodoro-session.model';

@Component({
  selector: 'app-pomodoro-session-type-switcher',
  standalone: true,
  template: `
    <div class="inline-flex rounded-full border border-border bg-bg-card p-1 text-xs font-semibold tracking-wide">
      <button type="button" (click)="changeType('focus')"
        class="px-3 py-1 rounded-full transition-all"
        [class.bg-primary]="activeType() === 'focus'" [class.text-white]="activeType() === 'focus'">
        Focus
      </button>
      <button type="button" (click)="changeType('shortBreak')"
        class="px-3 py-1 rounded-full transition-all"
        [class.bg-bg-app]="activeType() === 'shortBreak'" [class.text-primary]="activeType() === 'shortBreak'">
        Short Break
      </button>
      <button type="button" (click)="changeType('longBreak')"
        class="px-3 py-1 rounded-full transition-all"
        [class.bg-bg-app]="activeType() === 'longBreak'" [class.text-primary]="activeType() === 'longBreak'">
        Long Break
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTypeSwitcherComponent {
  activeType = input<PomodoroSessionType>('focus');
  typeChange = output<PomodoroSessionType>();

  changeType(type: PomodoroSessionType) {
    this.typeChange.emit(type);
  }
}
