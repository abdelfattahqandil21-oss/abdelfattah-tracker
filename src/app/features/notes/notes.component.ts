import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../main/header/header.component';
import { NoteEditorComponent } from './components/note-editor.component';
import { NoteListComponent } from './components/note-list.component';
import { NotesPageService } from './services/notes-page.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    NoteEditorComponent,
    NoteListComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  protected service = inject(NotesPageService);
  isLoading = signal(true);

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 400);
  }

  onDateChange(date: string) {
    this.service.setDate(date);
  }

  onSaveNote(content: string) {
    this.service.addNote(content);
  }

  onDeleteNote(id: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.service.deleteNote(id);
    }
  }
}
