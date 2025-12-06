import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-modal',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 z-40 transition-opacity"
        (click)="close.emit()">
      </div>

      <!-- Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          class="bg-bg-card rounded-xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-hidden"
          (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-border bg-bg-app">
            <h2 class="font-display font-bold text-text-main text-lg">{{ title() }}</h2>
            <button 
              (click)="close.emit()"
              class="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-border hover:text-text-main transition-colors">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="p-4 overflow-y-auto max-h-[60vh]">
            <ng-content></ng-content>
          </div>

          <!-- Footer (optional) -->
          @if (showFooter()) {
            <div class="p-4 border-t border-border bg-bg-app flex justify-end gap-2">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
   styles: [`
    :host {
      display: contents;
    }
  `]
})
export class ModalComponent {
   isOpen = input<boolean>(false);
   title = input<string>('');
   showFooter = input<boolean>(false);
   close = output<void>();
}
