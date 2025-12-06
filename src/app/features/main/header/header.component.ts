import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  navItems = [
    { path: '/main', label: 'Dashboard' },
    { path: '/sugar-tracker', label: 'Sugar' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/evaluations', label: 'Evaluations' },
    { path: '/notes', label: 'Notes' },
  ];
}
