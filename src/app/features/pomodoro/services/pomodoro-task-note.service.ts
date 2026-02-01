import { Injectable, signal, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { PomodoroTaskNoteLink, PomodoroSessionWithDetails, Task, Note } from '../../../shared/models/pomodoro-task-note.model';
import { generateId } from '../../../shared/utils/common.utils';

const LINKS_STORE = 'pomodoro-task-note-links';

@Injectable({ providedIn: 'root' })
export class PomodoroTaskNoteService {
  private localStorage = inject(LocalStorageService);
  
  // Using Sets for efficient data handling
  private taskLinks = signal<Set<string>>(new Set());
  private noteLinks = signal<Set<string>>(new Set());
  private links = signal<PomodoroTaskNoteLink[]>([]);

  constructor() {
    this.initialize();
  }

  private initialize() {
    const allLinks = this.localStorage.getAll<PomodoroTaskNoteLink>(LINKS_STORE);
    this.links.set(allLinks);
    
    // Initialize Sets for efficient lookup
    const taskSet = new Set<string>();
    const noteSet = new Set<string>();
    
    allLinks.forEach(link => {
      if (link.taskId) {
        taskSet.add(link.taskId);
      }
      if (link.noteId) {
        noteSet.add(link.noteId);
      }
    });
    
    this.taskLinks.set(taskSet);
    this.noteLinks.set(noteSet);
  }

  // Create link between Pomodoro session and task/note
  createLink(pomodoroSessionId: string, taskId?: string, noteId?: string): PomodoroTaskNoteLink {
    if (!taskId && !noteId) {
      throw new Error('Either taskId or noteId must be provided');
    }

    const link: PomodoroTaskNoteLink = {
      id: generateId(),
      pomodoroSessionId,
      taskId,
      noteId,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    this.localStorage.add(LINKS_STORE, link);
    
    const updatedLinks = [...this.links(), link];
    this.links.set(updatedLinks);

    // Update Sets
    if (taskId) {
      const newTaskSet = new Set(this.taskLinks());
      newTaskSet.add(taskId);
      this.taskLinks.set(newTaskSet);
    }
    
    if (noteId) {
      const newNoteSet = new Set(this.noteLinks());
      newNoteSet.add(noteId);
      this.noteLinks.set(newNoteSet);
    }

    return link;
  }

  // Get all links
  getAllLinks(): PomodoroTaskNoteLink[] {
    return this.links();
  }

  // Get links by Pomodoro session ID
  getLinksByPomodoroSession(pomodoroSessionId: string): PomodoroTaskNoteLink[] {
    return this.links().filter(link => link.pomodoroSessionId === pomodoroSessionId);
  }

  // Get tasks that have been linked to Pomodoro sessions
  getTasksWithPomodoroLinks(): Set<string> {
    return this.taskLinks();
  }

  // Get notes that have been linked to Pomodoro sessions
  getNotesWithPomodoroLinks(): Set<string> {
    return this.noteLinks();
  }

  // Get Pomodoro sessions with task and note details
  getPomodoroSessionsWithDetails(
    pomodoroSessions: any[],
    tasks: Task[],
    notes: Note[]
  ): PomodoroSessionWithDetails[] {
    return pomodoroSessions.map(session => {
      const links = this.getLinksByPomodoroSession(session.id);
      const taskLink = links.find(link => link.taskId);
      const noteLink = links.find(link => link.noteId);

      return {
        ...session,
        task: taskLink ? tasks.find(t => t.id === taskLink.taskId) : undefined,
        note: noteLink ? notes.find(n => n.id === noteLink.noteId) : undefined
      };
    });
  }

  // Get suggested tasks based on frequency and recent activity
  getSuggestedTasks(tasks: Task[], limit: number = 5): Task[] {
    const linkedTaskIds = this.getTasksWithPomodoroLinks();
    
    // Sort by: 1) Has Pomodoro links, 2) In progress, 3) Recent date
    return tasks
      .filter(task => task.status !== 'done')
      .sort((a, b) => {
        const aHasLinks = linkedTaskIds.has(a.id) ? 1 : 0;
        const bHasLinks = linkedTaskIds.has(b.id) ? 1 : 0;
        
        if (aHasLinks !== bHasLinks) return bHasLinks - aHasLinks;
        
        const aInProgress = a.status === 'progress' ? 1 : 0;
        const bInProgress = b.status === 'progress' ? 1 : 0;
        
        if (aInProgress !== bInProgress) return bInProgress - aInProgress;
        
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, limit);
  }

  // Get suggested notes based on recent activity
  getSuggestedNotes(notes: Note[], limit: number = 5): Note[] {
    const linkedNoteIds = this.getNotesWithPomodoroLinks();
    
    // Sort by: 1) Has Pomodoro links, 2) Recent date
    return notes
      .sort((a, b) => {
        const aHasLinks = linkedNoteIds.has(a.id) ? 1 : 0;
        const bHasLinks = linkedNoteIds.has(b.id) ? 1 : 0;
        
        if (aHasLinks !== bHasLinks) return bHasLinks - aHasLinks;
        
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, limit);
  }

  // Delete a link
  deleteLink(linkId: string) {
    const link = this.links().find(l => l.id === linkId);
    if (!link) return;

    this.localStorage.delete(LINKS_STORE, linkId);
    
    const updatedLinks = this.links().filter(l => l.id !== linkId);
    this.links.set(updatedLinks);

    // Update Sets
    if (link.taskId) {
      const newTaskSet = new Set(this.taskLinks());
      newTaskSet.delete(link.taskId);
      this.taskLinks.set(newTaskSet);
    }
    
    if (link.noteId) {
      const newNoteSet = new Set(this.noteLinks());
      newNoteSet.delete(link.noteId);
      this.noteLinks.set(newNoteSet);
    }
  }

  // Clear all links
  clearAllLinks() {
    this.localStorage.clearStore(LINKS_STORE);
    this.links.set([]);
    this.taskLinks.set(new Set());
    this.noteLinks.set(new Set());
  }
}
