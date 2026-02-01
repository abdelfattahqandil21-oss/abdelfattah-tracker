export interface PomodoroTaskNoteLink {
  id: string;
  pomodoroSessionId: string;
  taskId?: string;
  noteId?: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO string
}

export interface PomodoroSessionWithDetails {
  id: string;
  date: string;
  type: string;
  durationMinutes: number;
  startedAt: string;
  endedAt: string;
  completed: boolean;
  task?: Task;
  note?: Note;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'init' | 'progress' | 'done';
}

export interface Note {
  id: string;
  date: string;
  content: string;
}
