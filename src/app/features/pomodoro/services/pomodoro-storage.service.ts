import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { PomodoroSession } from '../models/pomodoro-session.model';
import { PomodoroSettings, DEFAULT_POMODORO_SETTINGS } from '../models/pomodoro-settings.model';

const SESSIONS_STORE = 'pomodoro-sessions';
const SETTINGS_STORE = 'pomodoro-settings';
const TIMER_STATE_STORE = 'pomodoro-timer-state';

interface PomodoroTimerStateWithExpiry {
  type: string;
  remainingSeconds: number;
  state: string;
  completedFocusCount: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class PomodoroStorageService {
  private localStorage = inject(LocalStorageService);

  getAllSessions(): PomodoroSession[] {
    return this.localStorage.getAll<PomodoroSession>(SESSIONS_STORE);
  }

  saveSession(session: PomodoroSession) {
    this.localStorage.add(SESSIONS_STORE, session);
  }

  updateSession(session: PomodoroSession) {
    this.localStorage.update(SESSIONS_STORE, session);
  }

  getSettings(): PomodoroSettings {
    const settings = this.localStorage.getAll<PomodoroSettings>(SETTINGS_STORE)[0];
    return settings ?? DEFAULT_POMODORO_SETTINGS;
  }

  saveSettings(settings: PomodoroSettings) {
    // store single settings object in the store
    const existing = this.localStorage.getAll<PomodoroSettings>(SETTINGS_STORE)[0];
    if (existing) {
      this.localStorage.clearStore(SETTINGS_STORE);
    }
    this.localStorage.add(SETTINGS_STORE, settings as any);
  }

  saveTimerState(type: string, remainingSeconds: number, state: string, completedFocusCount: number) {
    const timerState: PomodoroTimerStateWithExpiry = {
      type,
      remainingSeconds,
      state,
      completedFocusCount,
      timestamp: Date.now()
    };
    
    this.localStorage.clearStore(TIMER_STATE_STORE);
    this.localStorage.add(TIMER_STATE_STORE, timerState as any);
  }

  loadTimerState(): PomodoroTimerStateWithExpiry | null {
    const states = this.localStorage.getAll<PomodoroTimerStateWithExpiry>(TIMER_STATE_STORE);
    if (states.length === 0) return null;

    const state = states[0];
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // Check if expired (older than 1 day)
    if (now - state.timestamp > oneDayInMs) {
      this.localStorage.clearStore(TIMER_STATE_STORE);
      return null;
    }

    return state;
  }

  clearTimerState() {
    this.localStorage.clearStore(TIMER_STATE_STORE);
  }
}
