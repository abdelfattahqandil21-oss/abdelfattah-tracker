import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from './services/notes.service';
import { HeaderComponent } from '../main/header/header.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent {
  private service = inject(NotesService);
  notes = this.service.notes;

  newDate = signal(new Date().toISOString().split('T')[0]);
  newContent = signal('');

  filteredNotes = computed(() => {
    return this.notes().filter(n => n.date === this.newDate());
  });

  addNote() {
    if (!this.newContent()) return;

    const note = this.service.createNote(
      this.newDate(),
      this.newContent()
    );

    this.service.addOrUpdate(note);
    this.newContent.set('');
  }

  deleteNote(id: string) {
    if (confirm('Are you sure?')) {
      this.service.delete(id);
    }
  }
}
