import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../services/overview.service';

@Component({
   selector: 'app-alerts-card',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
    @if (alerts().length > 0) {
      <div class="mb-6">
        <div class="flex flex-wrap gap-3">
          @for (alert of alerts(); track alert.message) {
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
              [class.bg-bg-card]="alert.type === 'info'"
              [class.text-primary]="alert.type === 'info'"
              [class.border-primary]="alert.type === 'info'"
              [class.bg-bg-app]="alert.type === 'warning'"
              [class.text-warning]="alert.type === 'warning'"
              [class.border-warning]="alert.type === 'warning'"
              [class.bg-bg-card]="alert.type === 'danger'"
              [class.text-error]="alert.type === 'danger'"
              [class.border-error]="alert.type === 'danger'">
              <i class="pi" [class]="alert.icon"></i>
              {{ alert.message }}
            </div>
          }
        </div>
      </div>
    }
  `
})
export class AlertsCardComponent {
   alerts = input.required<Alert[]>();
}
