import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Note } from '../../../../shared/models/note.model';

@Component({
  selector: 'app-notes-preview-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-xl shadow-sm border border-border h-48">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold text-primary uppercase tracking-wider">Recent Notes</h3>
        <a routerLink="/notes" class="text-xs text-primary hover:underline">View All</a>
      </div>
      <div class="h-28 overflow-hidden">
        @if (notes().length === 0) {
          <p class="text-sm text-text-muted italic">No notes yet</p>
        } @else {
          <div class="space-y-2">
            @for (note of notes(); track note.id) {
              <div class="p-2 bg-bg-app rounded text-sm">
                <p class="text-text-main line-clamp-1">{{ note.content }}</p>
                <p class="text-xs text-text-muted mt-1">{{ note.date | date:'short' }}</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class NotesPreviewCardComponent {
  notes = input.required<Note[]>();
}
