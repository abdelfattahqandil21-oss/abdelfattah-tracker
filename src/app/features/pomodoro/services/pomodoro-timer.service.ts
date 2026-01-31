import { Injectable, signal, computed } from '@angular/core';
import { PomodoroSessionType } from '../models/pomodoro-session.model';
import { PomodoroSettings, DEFAULT_POMODORO_SETTINGS } from '../models/pomodoro-settings.model';

export type PomodoroTimerState = 'idle' | 'running' | 'paused' | 'finished';

@Injectable({ providedIn: 'root' })
export class PomodoroTimerService {
  private settingsSignal = signal<PomodoroSettings>(DEFAULT_POMODORO_SETTINGS);
  private currentType = signal<PomodoroSessionType>('focus');
  private remainingSeconds = signal(0);
  private state = signal<PomodoroTimerState>('idle');
  private completedFocusCount = signal(0);

  private intervalId: any = null;

  readonly settings = this.settingsSignal.asReadonly();
  readonly type = this.currentType.asReadonly();
  readonly timerState = this.state.asReadonly();
  readonly remaining = this.remainingSeconds.asReadonly();
  readonly focusCompleted = this.completedFocusCount.asReadonly();

  readonly totalSeconds = computed(() => {
    const s = this.settingsSignal();
    switch (this.currentType()) {
      case 'shortBreak':
        return s.shortBreakMinutes * 60;
      case 'longBreak':
        return s.longBreakMinutes * 60;
      default:
        return s.focusMinutes * 60;
    }
  });

  readonly progress = computed(() => {
    const total = this.totalSeconds();
    if (total === 0) return 0;
    return 1 - this.remainingSeconds() / total;
  });

  setSettings(settings: PomodoroSettings) {
    this.settingsSignal.set(settings);
    // لو التايمر مش شغال نعيد حساب الوقت
    if (this.state() === 'idle' || this.state() === 'finished') {
      this.reset();
    }
  }

  setType(type: PomodoroSessionType) {
    this.currentType.set(type);
    this.reset();
  }

  start() {
    if (this.state() === 'running') return;
    if (this.remainingSeconds() === 0) {
      this.remainingSeconds.set(this.totalSeconds());
    }
    this.state.set('running');
    this.tick();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pause() {
    if (this.state() !== 'running') return;
    this.state.set('paused');
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state.set('idle');
    this.remainingSeconds.set(this.totalSeconds());
  }

  private tick() {
    const current = this.remainingSeconds();
    if (current <= 1) {
      this.remainingSeconds.set(0);
      this.state.set('finished');
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.currentType() === 'focus') {
        this.completedFocusCount.update((v) => v + 1);
      }
      return;
    }
    this.remainingSeconds.set(current - 1);
  }

  // Public methods for state restoration
  setTimerState(type: PomodoroSessionType, remainingSeconds: number, timerState: PomodoroTimerState, completedFocusCount: number) {
    this.currentType.set(type);
    this.remainingSeconds.set(remainingSeconds);
    this.state.set(timerState);
    this.completedFocusCount.set(completedFocusCount);
    
    // If state is running, pause it to prevent unwanted timer continuation
    if (timerState === 'running') {
      this.state.set('paused');
    }
  }
}
