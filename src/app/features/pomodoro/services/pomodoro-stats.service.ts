import { Injectable, inject, computed, signal } from '@angular/core';
import { PomodoroStorageService } from './pomodoro-storage.service';
import { PomodoroSession, PomodoroSessionType } from '../models/pomodoro-session.model';

@Injectable({ providedIn: 'root' })
export class PomodoroStatsService {
  private storage = inject(PomodoroStorageService);
  private sessionsSignal = signal<PomodoroSession[]>(this.storage.getAllSessions());

  readonly sessions = this.sessionsSignal.asReadonly();

  readonly todayStats = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const sessionsToday = this.sessionsSignal().filter(s => s.date === today && s.completed);
    const focusSessions = sessionsToday.filter(s => s.type === 'focus');
    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      totalSessions: sessionsToday.length,
      focusSessions: focusSessions.length,
      totalFocusMinutes,
    };
  });

  addSession(session: PomodoroSession) {
    this.storage.saveSession(session);
    this.sessionsSignal.update(list => [session, ...list]);
  }
}
