import { Injectable, signal, inject } from '@angular/core';
import { IDBService } from '../../../core/services/idb.service';
import { Note } from '../../../shared/models/note.model';

const DB = 'venofy-tracker-db';
const STORE = 'notes';

@Injectable({ providedIn: 'root' })
export class NotesService {
   private idb = inject(IDBService);
   notes = signal<Note[]>([]);
   private isInitialized = false;

   constructor() {
      this.initialize();
   }

   private async initialize() {
      if (this.isInitialized) return;

      try {
         await this.idb.open(DB, STORE);
         const all = await this.idb.getAll<Note>(STORE);
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
            await this.idb.update(STORE, note);
            this.notes.update(list => list.map(n => n.id === note.id ? note : n));
         } else {
            await this.idb.add(STORE, note);
            this.notes.update(list => [note, ...list]);
         }
      } catch (error) {
         console.error('[NotesService] Error saving note:', error);
         throw error;
      }
   }

   async delete(id: string) {
      if (!this.isInitialized) await this.initialize();
      await this.idb.delete(STORE, id);
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
