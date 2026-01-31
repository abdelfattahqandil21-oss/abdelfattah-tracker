import { Component, ChangeDetectionStrategy, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent, FilterSection } from '../../../shared/components/filter-bar/filter-bar.component';
import { FilterPeriod } from '../services/evaluations-page.service';

@Component({
   selector: 'app-eval-filter-bar',
   standalone: true,
   imports: [CommonModule, FilterBarComponent],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
      <app-filter-bar [sections]="filterSections()" />
   `
})
export class EvalFilterBarComponent {
   activePeriod = input.required<FilterPeriod>();
   periodChange = output<FilterPeriod>();

   private periodChangeEmitter = new EventEmitter<string>();

   filterSections(): FilterSection[] {
      return [
         {
            label: 'Time Period',
            icon: 'pi-calendar',
            activeValue: this.activePeriod(),
            change: this.periodChangeEmitter,
            options: [
               { value: 'week', label: 'Last 7 Days' },
               { value: 'month', label: 'This Month' },
               { value: 'all', label: 'All Time' }
            ]
         }
      ];
   }

   constructor() {
      this.periodChangeEmitter.subscribe((value) => {
         this.periodChange.emit(value as FilterPeriod);
      });
   }
}
