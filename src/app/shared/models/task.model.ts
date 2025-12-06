export type TaskType = 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'init' | 'progress' | 'done';

export interface Task {
   id: string;
   title: string;
   description?: string;
   date: string; // YYYY-MM-DD (or start date for weekly/monthly)
   type: TaskType;
   status: TaskStatus;
}
