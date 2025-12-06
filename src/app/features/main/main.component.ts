import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { OverviewComponent } from './overview/overview.component';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, RouterLink, OverviewComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {

}
