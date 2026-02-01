import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { PomodoroTaskSelectorComponent } from './pomodoro-task-note-selector.component';

@Component({
  selector: 'app-pomodoro-timer-display',
  standalone: true,
  imports: [PomodoroTaskSelectorComponent],
  template: `
    <div class="bg-bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center">
      <p class="text-xs uppercase tracking-[0.3em] text-text-muted mb-2">Pomodoro</p>
      <h2 class="font-display text-5xl sm:text-6xl font-bold text-primary mb-2 cursor-pointer select-none"
        (click)="timeClick.emit()">
        {{ time() }}
      </h2>
      <p class="text-xs text-text-muted mb-4">{{ label() }}</p>
      <div class="w-full mb-4 h-2 bg-bg-app rounded-full overflow-hidden">
        <div class="h-full bg-primary transition-all duration-300" [style.width.%]="progress() * 100"></div>
      </div>
      
      <!-- Task Selection inside timer block -->
      <div class="w-full mt-2 space-y-3">
        <div class="text-center">
          <label class="text-xs font-semibold text-text-muted flex items-center justify-center gap-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Select Task
          </label>
        </div>
        
        <app-pomodoro-task-selector
          [selectedTaskId]="selectedTaskId()"
          (selectionChange)="taskSelectionChange.emit($event)" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerDisplayComponent {
  time = input<string>('25:00');
  label = input<string>('Focus Session');
  progress = input<number>(0);
  selectedTaskId = input<string>('');
  
  timeClick = output<void>();
  taskSelectionChange = output<{taskId?: string}>();
}
