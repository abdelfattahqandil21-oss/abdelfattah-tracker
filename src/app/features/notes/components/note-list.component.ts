import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../shared/models/note.model';

@Component({
   selector: 'app-note-list',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="space-y-3">
      @for (note of notes(); track note.id) {
        <div class="bg-bg-card p-4 rounded-lg shadow-sm border border-border flex items-start justify-between group hover:border-primary/50 transition-colors">
          <p class="text-text-main whitespace-pre-wrap leading-relaxed">{{ note.content }}</p>
          
          <button (click)="delete.emit(note.id)"
            class="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all ml-4 p-1 rounded hover:bg-bg-app"
            title="Delete note">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      } @empty {
        <div class="text-center text-text-muted py-12 bg-bg-card/50 rounded-lg border border-dashed border-border">
          <i class="pi pi-book text-4xl mb-3 opacity-50"></i>
          <p>No notes for this date</p>
        </div>
      }
    </div>
  `
})
export class NoteListComponent {
   notes = input.required<Note[]>();
   delete = output<string>();
}
