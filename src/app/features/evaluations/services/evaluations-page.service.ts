import { Injectable, inject, computed, signal } from '@angular/core';
import { EvaluationsService } from './evaluations.service';
import { Evaluation, EvaluationType } from '../../../shared/models/evaluation.model';

export interface EvalStats {
   activity: { avg: number; count: number; trend: 'up' | 'down' | 'same' };
   health: { avg: number; count: number; trend: 'up' | 'down' | 'same' };
   productivity: { avg: number; count: number; trend: 'up' | 'down' | 'same' };
   overall: { avg: number; count: number };
}

export interface DayEval {
   date: string;
   dateFormatted: string;
   activity?: number;
   health?: number;
   productivity?: number;
   avg: number;
}

export type FilterPeriod = 'week' | 'month' | 'all';

@Injectable({ providedIn: 'root' })
export class EvaluationsPageService {
   private evalService = inject(EvaluationsService);

   // State
   selectedDate = signal(new Date().toISOString().split('T')[0]);
   filterPeriod = signal<FilterPeriod>('week');
   currentWeekOffset = signal(0); // 0 = current week, -1 = last week, etc.

   // Get today
   private today = new Date().toISOString().split('T')[0];

   // Current week range
   currentWeekRange = computed(() => {
      const offset = this.currentWeekOffset();
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + (offset * 7)); // Start of week (Sunday)
      const end = new Date(start);
      end.setDate(end.getDate() + 6); // End of week (Saturday)

      return {
         start: start.toISOString().split('T')[0],
         end: end.toISOString().split('T')[0],
         label: this.formatWeekLabel(start, end)
      };
   });

   // Filtered evaluations
   filteredEvaluations = computed(() => {
      const evals = this.evalService.evaluations();
      const period = this.filterPeriod();

      if (period === 'week') {
         const range = this.currentWeekRange();
         return evals.filter(e => e.date >= range.start && e.date <= range.end);
      } else if (period === 'month') {
         const monthStart = this.getMonthStart();
         return evals.filter(e => e.date >= monthStart && e.date <= this.today);
      }
      return evals;
   });

   // Stats for each type
   stats = computed<EvalStats>(() => {
      const evals = this.filteredEvaluations();
      const lastWeekEvals = this.getLastWeekEvaluations();

      const calcStats = (type: EvaluationType) => {
         const filtered = evals.filter(e => e.type === type);
         const lastWeek = lastWeekEvals.filter(e => e.type === type);
         const avg = filtered.length > 0
            ? Math.round(filtered.reduce((sum, e) => sum + e.score, 0) / filtered.length * 10) / 10
            : 0;
         const lastAvg = lastWeek.length > 0
            ? lastWeek.reduce((sum, e) => sum + e.score, 0) / lastWeek.length
            : 0;
         const trend: 'up' | 'down' | 'same' = avg > lastAvg ? 'up' : avg < lastAvg ? 'down' : 'same';
         return { avg, count: filtered.length, trend };
      };

      const activity = calcStats('activity');
      const health = calcStats('health');
      const productivity = calcStats('productivity');
      const allAvg = [activity.avg, health.avg, productivity.avg].filter(a => a > 0);
      const overall = {
         avg: allAvg.length > 0 ? Math.round(allAvg.reduce((a, b) => a + b, 0) / allAvg.length * 10) / 10 : 0,
         count: evals.length
      };

      return { activity, health, productivity, overall };
   });

   // Today's evaluations
   todayEvaluations = computed(() => {
      return this.evalService.evaluations().filter(e => e.date === this.selectedDate());
   });

   // Check if type already evaluated today
   isEvaluated = computed(() => {
      const today = this.todayEvaluations();
      return {
         activity: today.some(e => e.type === 'activity'),
         health: today.some(e => e.type === 'health'),
         productivity: today.some(e => e.type === 'productivity')
      };
   });

   // Daily breakdown for chart
   dailyBreakdown = computed<DayEval[]>(() => {
      const evals = this.filteredEvaluations();
      const dates = new Map<string, { activity?: number; health?: number; productivity?: number }>();

      evals.forEach(e => {
         const existing = dates.get(e.date) || {};
         existing[e.type] = e.score;
         dates.set(e.date, existing);
      });

      return Array.from(dates.entries())
         .map(([date, scores]) => {
            const values = [scores.activity, scores.health, scores.productivity].filter(v => v !== undefined) as number[];
            return {
               date,
               dateFormatted: this.formatDate(date),
               activity: scores.activity,
               health: scores.health,
               productivity: scores.productivity,
               avg: values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10 : 0
            };
         })
         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
   });

   // Helper methods
   private getWeekStart(): string {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString().split('T')[0];
   }

   private getMonthStart(): string {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
   }

   private getLastWeekEvaluations(): Evaluation[] {
      const d = new Date();
      const weekEnd = new Date(d);
      weekEnd.setDate(d.getDate() - 7);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - 14);
      return this.evalService.evaluations().filter(e =>
         e.date >= weekStart.toISOString().split('T')[0] &&
         e.date < weekEnd.toISOString().split('T')[0]
      );
   }

   private formatDate(dateStr: string): string {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
   }

   private formatWeekLabel(start: Date, end: Date): string {
      const startStr = start.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      const endStr = end.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      return `${startStr} - ${endStr}`;
   }

   // Actions
   setDate(date: string) {
      this.selectedDate.set(date);
   }

   setPeriod(period: FilterPeriod) {
      this.filterPeriod.set(period);
      this.currentWeekOffset.set(0); // Reset offset when changing filter
   }

   nextWeek() {
      this.currentWeekOffset.update(v => v + 1);
   }

   prevWeek() {
      this.currentWeekOffset.update(v => v - 1);
   }

   addEvaluation(type: EvaluationType, score: number, notes?: string) {
      const eval_ = this.evalService.createEvaluation(
         this.selectedDate(),
         type,
         score,
         notes
      );
      this.evalService.addOrUpdate(eval_);
   }

   deleteEvaluation(id: string) {
      this.evalService.delete(id);
   }

   updateEvaluationScore(date: string, type: EvaluationType, score: number) {
      // Find the evaluation for this date and type
      const eval_ = this.evalService.evaluations().find(e => e.date === date && e.type === type);
      if (eval_) {
         this.evalService.addOrUpdate({ ...eval_, score });
      }
   }

   getScoreColor(score: number): string {
      if (score >= 8) return 'text-green-600';
      if (score >= 5) return 'text-yellow-600';
      return 'text-red-600';
   }

   getScoreBg(score: number): string {
      if (score >= 8) return 'bg-green-100 border-green-300';
      if (score >= 5) return 'bg-yellow-100 border-yellow-300';
      return 'bg-red-100 border-red-300';
   }
}
