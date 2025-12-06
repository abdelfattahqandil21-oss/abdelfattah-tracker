import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayEval } from '../services/evaluations-page.service';
import { EvaluationType } from '../../../shared/models/evaluation.model';

@Component({
  selector: 'app-eval-history-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card rounded-lg border border-border overflow-hidden">
      <div class="bg-bg-app px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 class="font-display font-bold text-primary uppercase tracking-wider text-sm">
          Evaluation History
        </h3>
        
        @if (showPagination()) {
          <div class="flex items-center gap-2">
            <button (click)="prev.emit()" class="p-1 hover:bg-bg-card rounded text-text-muted hover:text-primary transition-colors">
              <i class="pi pi-chevron-left"></i>
            </button>
            <span class="text-xs font-medium text-text-muted">{{ weekLabel() }}</span>
            <button (click)="next.emit()" class="p-1 hover:bg-bg-card rounded text-text-muted hover:text-primary transition-colors">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        }
      </div>

      @if (days().length === 0) {
        <div class="p-8 text-center text-text-muted">
          <i class="pi pi-chart-line text-4xl mb-2"></i>
          <p>No evaluations yet</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-bg-app border-b border-border">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
                  <i class="pi pi-bolt text-primary mr-1"></i> Activity
                </th>
                <th class="px-4 py-3 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
                  <i class="pi pi-heart text-primary mr-1"></i> Health
                </th>
                <th class="px-4 py-3 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
                  <i class="pi pi-chart-line text-primary mr-1"></i> Productivity
                </th>
                <th class="px-4 py-3 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
                  <i class="pi pi-star-fill text-primary mr-1"></i> Avg
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @for (day of days(); track day.date) {
                <tr class="hover:bg-bg-app transition-colors">
                  <td class="px-4 py-3 text-sm font-medium text-text-main">{{ day.dateFormatted }}</td>
                  <td class="px-4 py-3 text-center">
                    @if (day.activity !== undefined) {
                      @if (editingCell()?.date === day.date && editingCell()?.type === 'activity') {
                        <input type="number" min="1" max="10"
                          [ngModel]="editValue()"
                          (ngModelChange)="editValue.set($event)"
                          (blur)="saveEdit(day.date, 'activity')"
                          (keyup.enter)="saveEdit(day.date, 'activity')"
                          (keyup.escape)="cancelEdit()"
                          class="w-12 text-center p-1 border border-primary rounded bg-bg-input text-text-main">
                      } @else {
                        <span 
                          (click)="startEdit(day.date, 'activity', day.activity)"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold cursor-pointer hover:ring-2 hover:ring-primary border"
                          [class]="getScoreBg(day.activity)">
                          {{ day.activity }}
                        </span>
                      }
                    } @else {
                      <span class="text-text-muted">—</span>
                    }
                  </td>
                  <td class="px-4 py-3 text-center">
                    @if (day.health !== undefined) {
                      @if (editingCell()?.date === day.date && editingCell()?.type === 'health') {
                        <input type="number" min="1" max="10"
                          [ngModel]="editValue()"
                          (ngModelChange)="editValue.set($event)"
                          (blur)="saveEdit(day.date, 'health')"
                          (keyup.enter)="saveEdit(day.date, 'health')"
                          (keyup.escape)="cancelEdit()"
                          class="w-12 text-center p-1 border border-primary rounded bg-bg-input text-text-main">
                      } @else {
                        <span 
                          (click)="startEdit(day.date, 'health', day.health)"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold cursor-pointer hover:ring-2 hover:ring-primary border"
                          [class]="getScoreBg(day.health)">
                          {{ day.health }}
                        </span>
                      }
                    } @else {
                      <span class="text-text-muted">—</span>
                    }
                  </td>
                  <td class="px-4 py-3 text-center">
                    @if (day.productivity !== undefined) {
                      @if (editingCell()?.date === day.date && editingCell()?.type === 'productivity') {
                        <input type="number" min="1" max="10"
                          [ngModel]="editValue()"
                          (ngModelChange)="editValue.set($event)"
                          (blur)="saveEdit(day.date, 'productivity')"
                          (keyup.enter)="saveEdit(day.date, 'productivity')"
                          (keyup.escape)="cancelEdit()"
                          class="w-12 text-center p-1 border border-primary rounded bg-bg-input text-text-main">
                      } @else {
                        <span 
                          (click)="startEdit(day.date, 'productivity', day.productivity)"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold cursor-pointer hover:ring-2 hover:ring-primary border"
                          [class]="getScoreBg(day.productivity)">
                          {{ day.productivity }}
                        </span>
                      }
                    } @else {
                      <span class="text-text-muted">—</span>
                    }
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center justify-center w-10 h-8 rounded text-sm font-bold bg-primary/10 text-primary">
                      {{ day.avg }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class EvalHistoryTableComponent {
  days = input.required<DayEval[]>();
  showPagination = input(false);
  weekLabel = input('');

  scoreChanged = output<{ date: string; type: EvaluationType; score: number }>();
  next = output<void>();
  prev = output<void>();

  editingCell = signal<{ date: string; type: EvaluationType } | null>(null);
  editValue = signal<number>(0);

  startEdit(date: string, type: EvaluationType, currentValue: number) {
    this.editingCell.set({ date, type });
    this.editValue.set(currentValue);
  }

  saveEdit(date: string, type: EvaluationType) {
    const value = Math.min(10, Math.max(1, Number(this.editValue())));
    this.scoreChanged.emit({ date, type, score: value });
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingCell.set(null);
  }

  getScoreBg(score: number): string {
    if (score >= 8) return 'bg-bg-app text-success border-success';
    if (score >= 5) return 'bg-bg-app text-warning border-warning';
    return 'bg-bg-app text-error border-error';
  }
}
