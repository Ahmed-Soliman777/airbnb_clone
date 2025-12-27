import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inventory-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './inventory-search-filters.html',
  styleUrls: ['./inventory-search-filters.css'],
})
export class InventorySearchFiltersComponent {
  @Input() searchQuery: string = '';
  @Input() selectedPropertyType: string = '';
  @Input() propertyTypes: string[] = [];

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() selectedPropertyTypeChange = new EventEmitter<string>();
  @Output() applyFilters = new EventEmitter<void>();

  onSearchQueryChange(value: string) {
    this.searchQueryChange.emit(value);
  }

  onPropertyTypeChange(value: string) {
    this.selectedPropertyTypeChange.emit(value);
  }

  getPropertyTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
  }
}
