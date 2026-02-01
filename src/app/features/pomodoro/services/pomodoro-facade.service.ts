import { Injectable, inject, computed, signal } from '@angular/core';
import { PomodoroTimerService } from './pomodoro-timer.service';
import { PomodoroStorageService } from './pomodoro-storage.service';
import { PomodoroStatsService } from './pomodoro-stats.service';
import { PomodoroTaskNoteService } from './pomodoro-task-note.service';
import { TasksService } from '../../tasks/services/tasks.service';
import { NotesService } from '../../notes/services/notes.service';
import { PomodoroSession, PomodoroSessionType } from '../models/pomodoro-session.model';
import { PomodoroSettings } from '../models/pomodoro-settings.model';
import { Task, Note } from '../../../shared/models/pomodoro-task-note.model';
import { generateId } from '../../../shared/utils/common.utils';

@Injectable({ providedIn: 'root' })
export class PomodoroFacadeService {
  private timer = inject(PomodoroTimerService);
  private storage = inject(PomodoroStorageService);
  private stats = inject(PomodoroStatsService);
  private taskNoteService = inject(PomodoroTaskNoteService);
  private tasksService = inject(TasksService);

  readonly type = this.timer.type;
  readonly state = this.timer.timerState;
  readonly remainingSeconds = this.timer.remaining;
  readonly totalSeconds = this.timer.totalSeconds;
  readonly progress = this.timer.progress;
  readonly focusCompleted = this.timer.focusCompleted;

  readonly todayStats = this.stats.todayStats;

  // Current session task selection
  private currentSessionTaskId = signal<string>('');
  readonly currentSessionTaskIdRO = this.currentSessionTaskId.asReadonly();

  readonly formattedTime = computed(() => {
    const totalSeconds = this.timer.remaining();
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  readonly currentSettings = this.timer.settings;

  start() {
    this.timer.start();
    this.saveTimerState(); // Auto-save when starting
  }

  pause() {
    this.timer.pause();
    this.saveTimerState(); // Auto-save when pausing
  }

  reset() {
    this.timer.reset();
    this.saveTimerState(); // Auto-save when resetting
  }

  setType(type: PomodoroSessionType) {
    this.timer.setType(type);
    this.saveTimerState(); // Auto-save when changing type
  }

  updateSettings(settings: PomodoroSettings) {
    this.timer.setSettings(settings);
    this.storage.saveSettings(settings);
  }

  loadSettings() {
    const settings = this.storage.getSettings();
    this.timer.setSettings(settings);
  }

  completeCurrentSession() {
    const now = new Date();
    const settings = this.currentSettings();
    const type = this.type();

    let durationMinutes = 0;
    switch (type) {
      case 'shortBreak':
        durationMinutes = settings.shortBreakMinutes;
        break;
      case 'longBreak':
        durationMinutes = settings.longBreakMinutes;
        break;
      default:
        durationMinutes = settings.focusMinutes;
        break;
    }

    const session: PomodoroSession = {
      id: generateId(),
      date: now.toISOString().split('T')[0],
      type,
      durationMinutes,
      startedAt: now.toISOString(),
      endedAt: now.toISOString(),
      completed: true,
    };

    this.stats.addSession(session);

    // Create link to task if selected
    const taskId = this.currentSessionTaskId();
    
    if (taskId) {
      this.taskNoteService.createLink(session.id, taskId);
    }
  }

  // Task management methods
  setCurrentSessionTaskNote(taskId?: string) {
    this.currentSessionTaskId.set(taskId || '');
  }

  getCurrentSessionTaskNote() {
    return {
      taskId: this.currentSessionTaskIdRO()
    };
  }

  clearCurrentSessionTaskNote() {
    this.currentSessionTaskId.set('');
  }

  // Get sessions with task details
  getSessionsWithDetails() {
    const sessions = this.stats.sessions();
    const tasks: Task[] = this.tasksService.tasks();
    
    return this.taskNoteService.getPomodoroSessionsWithDetails(sessions, tasks, []);
  }

  // Get suggested tasks
  getSuggestedTasks() {
    const tasks: Task[] = this.tasksService.tasks();
    return this.taskNoteService.getSuggestedTasks(tasks);
  }

  saveTimerState() {
    this.storage.saveTimerState(
      this.type(),
      this.remainingSeconds(),
      this.state(),
      this.focusCompleted()
    );
  }

  loadTimerState() {
    const savedState = this.storage.loadTimerState();
    if (savedState) {
      this.timer.setTimerState(
        savedState.type as PomodoroSessionType,
        savedState.remainingSeconds,
        savedState.state as any,
        savedState.completedFocusCount
      );
    }
  }

  clearTimerState() {
    this.storage.clearTimerState();
  }
}
