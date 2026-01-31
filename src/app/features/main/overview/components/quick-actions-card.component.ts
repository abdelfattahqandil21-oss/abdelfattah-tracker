import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-actions-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-card p-4 sm:p-5 rounded-xl shadow-sm border border-border h-40 sm:h-48">
      <h3 class="font-display text-xs sm:text-sm font-bold text-primary uppercase tracking-wider mb-3 sm:mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <a routerLink="/sugar-tracker" class="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary hover:shadow-sm transition-all duration-200 text-xs sm:text-sm font-medium min-h-[44px] sm:min-h-[48px]">
          <i class="pi pi-plus-circle text-sm sm:text-base"></i> 
          <span class="hidden sm:inline">Add Sugar</span>
          <span class="sm:hidden">Sugar</span>
        </a>
        <a routerLink="/tasks" class="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary hover:shadow-sm transition-all duration-200 text-xs sm:text-sm font-medium min-h-[44px] sm:min-h-[48px]">
          <i class="pi pi-check-square text-sm sm:text-base"></i> 
          <span class="hidden sm:inline">Add Task</span>
          <span class="sm:hidden">Task</span>
        </a>
        <a routerLink="/evaluations" class="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary hover:shadow-sm transition-all duration-200 text-xs sm:text-sm font-medium min-h-[44px] sm:min-h-[48px]">
          <i class="pi pi-chart-bar text-sm sm:text-base"></i> 
          <span class="hidden sm:inline">Evaluate</span>
          <span class="sm:hidden">Eval</span>
        </a>
        <a routerLink="/notes" class="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-bg-app text-primary border border-border hover:border-primary hover:shadow-sm transition-all duration-200 text-xs sm:text-sm font-medium min-h-[44px] sm:min-h-[48px]">
          <i class="pi pi-file-edit text-sm sm:text-base"></i> 
          <span class="hidden sm:inline">Add Note</span>
          <span class="sm:hidden">Note</span>
        </a>
      </div>
    </div>
  `
})
export class QuickActionsCardComponent { }
