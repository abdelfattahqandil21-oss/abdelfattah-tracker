import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-note-editor',
   standalone: true,
   imports: [CommonModule, FormsModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    <div class="bg-bg-card p-4 rounded-lg shadow border border-border space-y-4">
      <div class="flex flex-col gap-2">
        <textarea 
          [ngModel]="content()" 
          (ngModelChange)="content.set($event)"
          placeholder="Write your note here..."
          class="w-full p-3 border border-border rounded-lg min-h-[120px] bg-bg-input text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y transition-all"
          (keydown.control.enter)="submit()"></textarea>
        
        <div class="flex justify-between items-center">
          <span class="text-xs text-text-muted">Press Ctrl+Enter to save</span>
          <button (click)="submit()"
            [disabled]="!content().trim()"
            class="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium">
            <i class="pi pi-save"></i>
            Save Note
          </button>
        </div>
      </div>
    </div>
  `
})
export class NoteEditorComponent {
   save = output<string>();
   content = signal('');

   submit() {
      if (this.content().trim()) {
         this.save.emit(this.content());
         this.content.set('');
      }
   }
}
