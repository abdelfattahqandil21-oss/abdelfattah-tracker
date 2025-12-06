import { Injectable, inject, signal, computed } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from '../../../shared/models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesPageService {
   private notesService = inject(NotesService);

   // State
   selectedDate = signal(new Date().toISOString().split('T')[0]);

   // Computed
   notes = this.notesService.notes;

   filteredNotes = computed(() => {
      return this.notes().filter(n => n.date === this.selectedDate());
   });

   // Actions
   setDate(date: string) {
      this.selectedDate.set(date);
   }

   addNote(content: string) {
      const note = this.notesService.createNote(this.selectedDate(), content);
      this.notesService.addOrUpdate(note);
   }

   deleteNote(id: string) {
      this.notesService.delete(id);
   }
}
