import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationType } from '../../../shared/models/evaluation.model';

@Component({
  selector: 'app-eval-quick-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-5 rounded-lg border border-border">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-bold text-primary uppercase tracking-wider text-sm">
          Rate Your Day
        </h3>
        <input 
          type="date" 
          [ngModel]="selectedDate()" 
          (ngModelChange)="dateChange.emit($event)"
          class="p-2 border border-border rounded bg-bg-input text-text-main text-sm">
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Activity -->
        <div class="p-4 rounded-lg border-2 transition-all"
          [class.border-primary]="!isEvaluated().activity"
          [class.bg-bg-app]="true"
          [class.border-border]="isEvaluated().activity"
          [class.opacity-60]="isEvaluated().activity">
          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-bolt text-2xl text-primary"></i>
            <span class="font-bold text-text-main">Activity</span>
            @if (isEvaluated().activity) {
              <i class="pi pi-check-circle text-success ml-auto"></i>
            }
          </div>
          @if (!isEvaluated().activity) {
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <input type="range" min="1" max="10" 
                  [ngModel]="activityScore()" 
                  (ngModelChange)="activityScore.set(+$event)"
                  class="flex-1 accent-primary">
                <span class="w-8 text-center font-bold text-lg" [class]="getScoreColor(activityScore())">
                  {{ activityScore() }}
                </span>
              </div>
              <button 
                (click)="submit('activity', activityScore())"
                class="w-full py-2 bg-primary text-text-inverse rounded-lg font-medium hover:bg-primary-dark transition-colors">
                <i class="pi pi-check mr-2"></i> Save
              </button>
            </div>
          } @else {
            <p class="text-sm text-text-muted italic">Already rated today</p>
          }
        </div>

        <!-- Health -->
        <div class="p-4 rounded-lg border-2 transition-all"
          [class.border-primary]="!isEvaluated().health"
          [class.bg-bg-app]="true"
          [class.border-border]="isEvaluated().health"
          [class.opacity-60]="isEvaluated().health">
          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-heart text-2xl text-primary"></i>
            <span class="font-bold text-text-main">Health</span>
            @if (isEvaluated().health) {
              <i class="pi pi-check-circle text-success ml-auto"></i>
            }
          </div>
          @if (!isEvaluated().health) {
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <input type="range" min="1" max="10" 
                  [ngModel]="healthScore()" 
                  (ngModelChange)="healthScore.set(+$event)"
                  class="flex-1 accent-primary">
                <span class="w-8 text-center font-bold text-lg" [class]="getScoreColor(healthScore())">
                  {{ healthScore() }}
                </span>
              </div>
              <button 
                (click)="submit('health', healthScore())"
                class="w-full py-2 bg-primary text-text-inverse rounded-lg font-medium hover:bg-primary-dark transition-colors">
                <i class="pi pi-check mr-2"></i> Save
              </button>
            </div>
          } @else {
            <p class="text-sm text-text-muted italic">Already rated today</p>
          }
        </div>

        <!-- Productivity -->
        <div class="p-4 rounded-lg border-2 transition-all"
          [class.border-primary]="!isEvaluated().productivity"
          [class.bg-bg-app]="true"
          [class.border-border]="isEvaluated().productivity"
          [class.opacity-60]="isEvaluated().productivity">
          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-chart-line text-2xl text-primary"></i>
            <span class="font-bold text-text-main">Productivity</span>
            @if (isEvaluated().productivity) {
              <i class="pi pi-check-circle text-success ml-auto"></i>
            }
          </div>
          @if (!isEvaluated().productivity) {
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <input type="range" min="1" max="10" 
                  [ngModel]="productivityScore()" 
                  (ngModelChange)="productivityScore.set(+$event)"
                  class="flex-1 accent-primary">
                <span class="w-8 text-center font-bold text-lg" [class]="getScoreColor(productivityScore())">
                  {{ productivityScore() }}
                </span>
              </div>
              <button 
                (click)="submit('productivity', productivityScore())"
                class="w-full py-2 bg-primary text-text-inverse rounded-lg font-medium hover:bg-primary-dark transition-colors">
                <i class="pi pi-check mr-2"></i> Save
              </button>
            </div>
          } @else {
            <p class="text-sm text-text-muted italic">Already rated today</p>
          }
        </div>
      </div>
    </div>
  `
})
export class EvalQuickAddComponent {
  selectedDate = input.required<string>();
  isEvaluated = input.required<{ activity: boolean; health: boolean; productivity: boolean }>();
  dateChange = output<string>();
  evalAdded = output<{ type: EvaluationType; score: number }>();

  activityScore = signal(7);
  healthScore = signal(7);
  productivityScore = signal(7);

  submit(type: EvaluationType, score: number) {
    this.evalAdded.emit({ type, score: Number(score) });
  }

  getScoreColor(score: number): string {
    if (score >= 8) return 'text-success';
    if (score >= 5) return 'text-warning';
    return 'text-error';
  }
}
