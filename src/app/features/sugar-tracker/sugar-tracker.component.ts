import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { SugarService } from './services/sugar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../main/header/header.component";
import { SugarEntry } from '../../shared/models/sugar-entry.model';

@Component({
  selector: 'app-sugar-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './sugar-tracker.component.html',
  styleUrls: ['./sugar-tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SugarTrackerComponent {
  private service = inject(SugarService);

  // Using the getter from the service
  entries = this.service.entries;

  today = signal(new Date().toISOString().split('T')[0]);

  // Computed signal for filtered entries (currently just returns all, but ready for filtering)
  filtered = computed(() => this.entries());

  addEntry(date: string, meal: 'breakfast' | 'lunch' | 'dinner', timing: 'before' | 'after') {
    const newEntry = this.service.createEntry(date, meal, timing);
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