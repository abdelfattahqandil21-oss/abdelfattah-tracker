export type PomodoroSessionType = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  id: string;
  date: string; // YYYY-MM-DD
  type: PomodoroSessionType;
  durationMinutes: number;
  startedAt: string; // ISO string
  endedAt: string | null; // ISO string when completed
  completed: boolean;
}
