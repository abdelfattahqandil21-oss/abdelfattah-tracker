import { Injectable, inject, computed, signal } from '@angular/core';
import { SugarService } from '../../../sugar-tracker/services/sugar.service';
import { TasksService } from '../../../tasks/services/tasks.service';
import { EvaluationsService } from '../../../evaluations/services/evaluations.service';
import { NotesService } from '../../../notes/services/notes.service';

export interface TodaySummary {
   sugarReadings: number;
   avgSugar: number | null;
   tasksTotal: number;
   tasksCompleted: number;
}

export interface Trends {
   thisWeekAvg: number;
   lastWeekAvg: number;
   diff: number;
   trend: 'up' | 'down' | 'stable';
   highest: number;
   lowest: number;
}

export interface CalendarDay {
   date: string;
   dayName: string;
   dayNum: number;
   avg: number | null;
   level: 'none' | 'low' | 'good' | 'warning' | 'high';
}

export interface Alert {
   type: 'info' | 'warning' | 'danger';
   message: string;
   icon: string;
}

export interface ChartData {
   labels: string[];
   breakfastBefore: (number | null)[];
   breakfastAfter: (number | null)[];
   lunchBefore: (number | null)[];
   lunchAfter: (number | null)[];
   dinnerBefore: (number | null)[];
   dinnerAfter: (number | null)[];
   dailyAvg: (number | null)[];
}

@Injectable({ providedIn: 'root' })
export class OverviewService {
   private sugarService = inject(SugarService);
   private tasksService = inject(TasksService);
   private evaluationsService = inject(EvaluationsService);
   private notesService = inject(NotesService);

   // ========== TODAY'S SUMMARY ==========
   todaySummary = computed<TodaySummary>(() => {
      const today = new Date().toISOString().split('T')[0];
      const entries = this.sugarService.entries();
      const todayEntries = entries.filter(e => e.date === today);
      const todayValues = todayEntries.filter(e => e.value !== null);

      const tasks = this.tasksService.tasks();
      const todayTasks = tasks.filter(t => t.date === today);
      const completedToday = todayTasks.filter(t => t.status === 'done').length;

      return {
         sugarReadings: todayEntries.length,
         avgSugar: todayValues.length > 0
            ? Math.round(todayValues.reduce((a, b) => a + (b.value || 0), 0) / todayValues.length)
            : null,
         tasksTotal: todayTasks.length,
         tasksCompleted: completedToday
      };
   });

   // ========== TRENDS ==========
   trends = computed<Trends>(() => {
      const entries = this.sugarService.entries();
      const now = new Date();

      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - 7);
      const thisWeekEntries = entries.filter(e => {
         const d = new Date(e.date);
         return d >= thisWeekStart && d <= now && e.value !== null;
      });
      const thisWeekAvg = thisWeekEntries.length > 0
         ? thisWeekEntries.reduce((a, b) => a + (b.value || 0), 0) / thisWeekEntries.length
         : 0;

      const lastWeekEnd = new Date(thisWeekStart);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 7);
      const lastWeekEntries = entries.filter(e => {
         const d = new Date(e.date);
         return d >= lastWeekStart && d <= lastWeekEnd && e.value !== null;
      });
      const lastWeekAvg = lastWeekEntries.length > 0
         ? lastWeekEntries.reduce((a, b) => a + (b.value || 0), 0) / lastWeekEntries.length
         : 0;

      const diff = thisWeekAvg - lastWeekAvg;
      const trend = diff > 5 ? 'up' : diff < -5 ? 'down' : 'stable';

      const allValues = entries.filter(e => e.value !== null).map(e => e.value!);
      const highest = allValues.length > 0 ? Math.max(...allValues) : 0;
      const lowest = allValues.length > 0 ? Math.min(...allValues) : 0;

      return {
         thisWeekAvg: Math.round(thisWeekAvg),
         lastWeekAvg: Math.round(lastWeekAvg),
         diff: Math.round(Math.abs(diff)),
         trend,
         highest,
         lowest
      };
   });

   // ========== CALENDAR HEATMAP ==========
   calendarData = computed<CalendarDay[]>(() => {
      const entries = this.sugarService.entries();
      const days: CalendarDay[] = [];

      for (let i = 29; i >= 0; i--) {
         const date = new Date();
         date.setDate(date.getDate() - i);
         const dateStr = date.toISOString().split('T')[0];
         const dayEntries = entries.filter(e => e.date === dateStr && e.value !== null);
         const avg = dayEntries.length > 0
            ? Math.round(dayEntries.reduce((a, b) => a + (b.value || 0), 0) / dayEntries.length)
            : null;

         let level: CalendarDay['level'] = 'none';
         if (avg !== null) {
            if (avg < 70) level = 'low';
            else if (avg <= 140) level = 'good';
            else if (avg <= 180) level = 'warning';
            else level = 'high';
         }

         days.push({
            date: dateStr,
            dayName: date.toLocaleDateString('en', { weekday: 'short' }),
            dayNum: date.getDate(),
            avg,
            level
         });
      }
      return days;
   });

   // ========== RECENT NOTES ==========
   recentNotes = computed(() => this.notesService.notes().slice(0, 3));

   // ========== ALERTS ==========
   alerts = computed<Alert[]>(() => {
      const warnings: Alert[] = [];
      const entries = this.sugarService.entries();
      const today = new Date().toISOString().split('T')[0];

      const todayEntries = entries.filter(e => e.date === today);
      if (todayEntries.length === 0) {
         warnings.push({ type: 'info', message: 'No sugar readings recorded today', icon: 'pi-info-circle' });
      }

      const recentHigh = entries.slice(0, 5).filter(e => e.value && e.value > 180);
      if (recentHigh.length >= 2) {
         warnings.push({ type: 'warning', message: `${recentHigh.length} high readings recently`, icon: 'pi-exclamation-triangle' });
      }

      const recentLow = entries.slice(0, 5).filter(e => e.value && e.value < 70);
      if (recentLow.length >= 1) {
         warnings.push({ type: 'danger', message: 'Low sugar detected recently', icon: 'pi-exclamation-circle' });
      }

      const pendingTasks = this.tasksService.tasks().filter(t => t.status !== 'done');
      if (pendingTasks.length > 5) {
         warnings.push({ type: 'info', message: `${pendingTasks.length} pending tasks`, icon: 'pi-list-check' });
      }

      return warnings;
   });

   // ========== SUGAR STATS ==========
   sugarStats = computed(() => {
      const entries = this.sugarService.entries();
      if (entries.length === 0) return { avg: 0, last: 0, count: 0 };

      const last = entries[0].value || 0;
      const validEntries = entries.filter(e => e.value !== null);
      const avg = validEntries.length > 0
         ? validEntries.reduce((acc, curr) => acc + (curr.value || 0), 0) / validEntries.length
         : 0;

      return { avg: Math.round(avg), last, count: entries.length };
   });

   // ========== TASK STATS ==========
   taskStats = computed(() => {
      const tasks = this.tasksService.tasks();
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'done').length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, pending, completionRate };
   });

   // ========== EVAL STATS ==========
   evalStats = computed(() => {
      const evals = this.evaluationsService.evaluations();
      if (evals.length === 0) return { activity: '0.0', health: '0.0', productivity: '0.0' };

      const getAvg = (type: string) => {
         const typeEvals = evals.filter(e => e.type === type);
         return typeEvals.length > 0
            ? (typeEvals.reduce((acc, curr) => acc + curr.score, 0) / typeEvals.length).toFixed(1)
            : '0.0';
      };

      return {
         activity: getAvg('activity'),
         health: getAvg('health'),
         productivity: getAvg('productivity')
      };
   });

   // ========== CHART DATA ==========
   chartData = computed<ChartData>(() => {
      const entries = this.sugarService.entries();
      const today = new Date();
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(today.getDate() - 14);

      const recentEntries = entries.filter(e => {
         const entryDate = new Date(e.date);
         return entryDate >= fourteenDaysAgo && entryDate <= today;
      });

      const dates = [...new Set(recentEntries.map(e => e.date))].sort((a, b) =>
         new Date(a).getTime() - new Date(b).getTime()
      );

      const breakfastBefore: (number | null)[] = [];
      const breakfastAfter: (number | null)[] = [];
      const lunchBefore: (number | null)[] = [];
      const lunchAfter: (number | null)[] = [];
      const dinnerBefore: (number | null)[] = [];
      const dinnerAfter: (number | null)[] = [];
      const dailyAvg: (number | null)[] = [];

      dates.forEach(date => {
         const dayEntries = recentEntries.filter(e => e.date === date);
         const getValue = (meal: string, timing: string) => {
            const entry = dayEntries.find(e => e.meal === meal && e.timing === timing);
            return entry?.value || null;
         };

         breakfastBefore.push(getValue('breakfast', 'before'));
         breakfastAfter.push(getValue('breakfast', 'after'));
         lunchBefore.push(getValue('lunch', 'before'));
         lunchAfter.push(getValue('lunch', 'after'));
         dinnerBefore.push(getValue('dinner', 'before'));
         dinnerAfter.push(getValue('dinner', 'after'));

         const dayValues = dayEntries.filter(e => e.value !== null).map(e => e.value!);
         const avg = dayValues.length > 0 ? dayValues.reduce((a, b) => a + b, 0) / dayValues.length : null;
         dailyAvg.push(avg ? Math.round(avg) : null);
      });

      return {
         labels: dates.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })),
         breakfastBefore, breakfastAfter, lunchBefore, lunchAfter,
         dinnerBefore, dinnerAfter, dailyAvg
      };
   });
}
