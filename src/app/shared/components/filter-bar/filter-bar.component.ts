import { Component, ChangeDetectionStrategy, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSection {
  label: string;
  icon: string;
  options: FilterOption[];
  activeValue: string;
  change: EventEmitter<string>;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-4 rounded-lg border border-border">
      <div class="flex flex-wrap gap-6 items-start justify-between">
        
        @for (section of sections(); track section.label) {
          <div class="space-y-2">
            <label class="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <i class="pi {{ section.icon }} text-primary"></i>
              {{ section.label }}
            </label>
            <div class="flex gap-1">
              @for (option of section.options; track option.value) {
                <button 
                  (click)="section.change.emit(option.value)"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                  [class.bg-primary]="section.activeValue === option.value"
                  [class.text-text-inverse]="section.activeValue === option.value"
                  [class.border-primary]="section.activeValue === option.value"
                  [class.bg-bg-app]="section.activeValue !== option.value"
                  [class.text-text-main]="section.activeValue !== option.value"
                  [class.border-border]="section.activeValue !== option.value"
                  [class.hover:border-primary]="section.activeValue !== option.value">
                  {{ option.label }}
                </button>
              }
            </div>
          </div>

          @if (!isLast(section)) {
            <div class="hidden md:block w-px h-12 bg-border self-center"></div>
          }
        }

        @if (customContent()) {
          <ng-content></ng-content>
        }
      </div>
    </div>
  `
})
export class FilterBarComponent {
  sections = input.required<FilterSection[]>();
  customContent = input<boolean>(false);

  isLast(currentSection: FilterSection): boolean {
    const allSections = this.sections();
    return allSections[allSections.length - 1] === currentSection;
  }
}
