import { Injectable, signal, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Note } from '../../../shared/models/note.model';
import { sortByDate } from '../../../shared/utils/sort.utils';
import { generateId, findById, updateById, filterById, prependItem } from '../../../shared/utils/common.utils';

const STORE = 'notes';

@Injectable({ providedIn: 'root' })
export class NotesService {
   private localStorage = inject(LocalStorageService);
   notes = signal<Note[]>([]);

   constructor() {
      this.initialize();
   }

   private initialize() {
      const all = this.localStorage.getAll<Note>(STORE);
      this.notes.set(sortByDate(all));
   }

   addOrUpdate(note: Note) {
      const exists = findById(this.notes(), note.id);
      if (exists) {
         this.localStorage.update(STORE, note);
         this.notes.set(updateById(this.notes(), note));
      } else {
         this.localStorage.add(STORE, note);
         this.notes.set(prependItem(this.notes(), note));
      }
   }

   delete(id: string) {
      this.localStorage.delete(STORE, id);
      this.notes.set(filterById(this.notes(), id));
   }

   createNote(date: string, content: string): Note {
      return { id: generateId(), date, content };
   }
}
