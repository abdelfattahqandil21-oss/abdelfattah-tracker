import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { HeaderComponent } from '../main/header/header.component';
import { TimerDisplayComponent } from './components/timer-display.component';
import { TimerControlsComponent } from './components/timer-controls.component';
import { SessionTypeSwitcherComponent } from './components/session-type-switcher.component';
import { StatsSummaryComponent } from './components/stats-summary.component';
import { PomodoroFacadeService } from './services/pomodoro-facade.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-pomodoro-page',
  standalone: true,
  imports: [HeaderComponent, TimerDisplayComponent, TimerControlsComponent, SessionTypeSwitcherComponent, StatsSummaryComponent, ModalComponent],
  templateUrl: './pomodoro-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroPageComponent implements OnInit, OnDestroy {
  protected facade = inject(PomodoroFacadeService);
  isTimeModalOpen = signal(false);
  timeInput = signal<string>('');
  private unloadListener: ((event: BeforeUnloadEvent) => void) | null = null;

  ngOnInit() {
    this.facade.loadSettings();
    this.facade.loadTimerState(); // Load saved timer state
    this.facade.reset();
    
    // Add beforeunload event listener to save timer state when user leaves
    this.unloadListener = this.onBeforeUnload.bind(this);
    window.addEventListener('beforeunload', this.unloadListener);
  }

  ngOnDestroy() {
    // Save timer state when component is destroyed
    this.facade.saveTimerState();
    
    // Remove event listener
    if (this.unloadListener) {
      window.removeEventListener('beforeunload', this.unloadListener);
    }
  }

  private onBeforeUnload(event: BeforeUnloadEvent) {
    // Save timer state when user is leaving the page
    this.facade.saveTimerState();
  }

  get isRunning() {
    return this.facade.state() === 'running';
  }

  onTimeClick() {
    const settings = this.facade.currentSettings();
    const type = this.facade.type();

    const currentMinutes =
      type === 'shortBreak'
        ? settings.shortBreakMinutes
        : type === 'longBreak'
          ? settings.longBreakMinutes
          : settings.focusMinutes;

    this.timeInput.set(String(currentMinutes));
    this.isTimeModalOpen.set(true);
  }

  onTimeInputChange(value: string) {
    this.timeInput.set(value);
  }

  closeTimeModal() {
    this.isTimeModalOpen.set(false);
  }

  saveTime() {
    const raw = this.timeInput().trim();
    const minutes = Number(raw);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return;
    }

    const settings = this.facade.currentSettings();
    const type = this.facade.type();
    const newSettings = { ...settings };

    if (type === 'shortBreak') {
      newSettings.shortBreakMinutes = minutes;
    } else if (type === 'longBreak') {
      newSettings.longBreakMinutes = minutes;
    } else {
      newSettings.focusMinutes = minutes;
    }

    this.facade.updateSettings(newSettings);
    this.facade.reset();
    this.closeTimeModal();
  }
}
