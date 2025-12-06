import { Component, ChangeDetectionStrategy, computed, inject, signal, OnInit } from '@angular/core';
import { SugarService } from './services/sugar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../main/header/header.component";
import { SugarEntry } from '../../shared/models/sugar-entry.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

interface DayRow {
  date: string;
  breakfastBefore: number | null;
  breakfastAfter: number | null;
  lunchBefore: number | null;
  lunchAfter: number | null;
  dinnerBefore: number | null;
  dinnerAfter: number | null;
}

@Component({
  selector: 'app-sugar-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './sugar-tracker.component.html',
  styleUrls: ['./sugar-tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SugarTrackerComponent implements OnInit {
  private service = inject(SugarService);
  isLoading = signal(true);

  entries = this.service.entries;

  today = signal(new Date().toISOString().split('T')[0]);

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  filtered = computed(() => this.entries());

  last14Days = computed(() => {
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    return this.entries().filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= fourteenDaysAgo && entryDate <= today;
    });
  });

  // Group entries by date for the table
  groupedByDate = computed(() => {
    const entries = this.last14Days();
    const grouped = new Map<string, DayRow>();

    // Get all unique dates and sort them (oldest first)
    const dates = [...new Set(entries.map(e => e.date))].sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime()
    );

    // Initialize rows for each date
    dates.forEach(date => {
      grouped.set(date, {
        date,
        breakfastBefore: null,
        breakfastAfter: null,
        lunchBefore: null,
        lunchAfter: null,
        dinnerBefore: null,
        dinnerAfter: null
      });
    });

    // Fill in the values
    entries.forEach(entry => {
      const row = grouped.get(entry.date);
      if (row) {
        const key = `${entry.meal}${entry.timing === 'before' ? 'Before' : 'After'}` as keyof DayRow;
        if (key !== 'date') {
          (row as any)[key] = entry.value;
        }
      }
    });

    return Array.from(grouped.values());
  });

  addEntry(date: string, meal: 'breakfast' | 'lunch' | 'dinner', timing: 'before' | 'after') {
    const newEntry = this.service.createEntry(date, meal, timing);
    this.service.addOrUpdate(newEntry);
  }

  addEntryWithValue(date: string, meal: 'breakfast' | 'lunch' | 'dinner', timing: 'before' | 'after', value: number, note: string = '') {
    const newEntry = this.service.createEntry(date, meal, timing);
    newEntry.value = value || null;
    newEntry.note = note;
    this.service.addOrUpdate(newEntry);
  }

  save(entry: SugarEntry) {
    this.service.addOrUpdate(entry);
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.service.remove(id);
    }
  }

  getValueColor(value: number | null): string {
    if (!value) return 'text-text-muted';
    if (value < 70) return 'text-warning';
    if (value > 180) return 'text-error';
    return 'text-success';
  }
}