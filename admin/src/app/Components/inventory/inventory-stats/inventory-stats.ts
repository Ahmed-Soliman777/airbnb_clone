import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inventory-stats',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './inventory-stats.html',
  styleUrls: ['./inventory-stats.css'],
})
export class InventoryStatsComponent {
  @Input() totalListings: number = 0;
  @Input() totalExperiences: number = 0;
  @Input() totalServices: number = 0;
  @Input() listingsGrowth: number = 0;
  @Input() experiencesGrowth: number = 0;
  @Input() servicesGrowth: number = 0;
}
