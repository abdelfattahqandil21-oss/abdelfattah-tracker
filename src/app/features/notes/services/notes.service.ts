import { Injectable, signal, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Note } from '../../../shared/models/note.model';

const STORE = 'notes';

@Injectable({ providedIn: 'root' })
export class NotesService {
   private localStorage = inject(LocalStorageService);
   notes = signal<Note[]>([]);
   private isInitialized = false;

   constructor() {
      this.initialize();
   }

   private async initialize() {
      if (this.isInitialized) return;

      try {
         const all = this.localStorage.getAll<Note>(STORE);
         this.notes.set(all.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
         ));
         this.isInitialized = true;
      } catch (error) {
         console.error('[NotesService] Initialization error:', error);
      }
   }

   async addOrUpdate(note: Note) {
      if (!this.isInitialized) await this.initialize();

      try {
         const exists = this.notes().some(n => n.id === note.id);
         if (exists) {
            this.localStorage.update(STORE, note);
            this.notes.update(list => list.map(n => n.id === note.id ? note : n));
         } else {
            this.localStorage.add(STORE, note);
            this.notes.update(list => [note, ...list]);
         }
      } catch (error) {
         console.error('[NotesService] Error saving note:', error);
         throw error;
      }
   }

   async delete(id: string) {
      if (!this.isInitialized) await this.initialize();
      this.localStorage.delete(STORE, id);
      this.notes.update(list => list.filter(n => n.id !== id));
   }

   createNote(date: string, content: string): Note {
      return {
         id: crypto.randomUUID(),
         date,
         content
      };
   }
}
