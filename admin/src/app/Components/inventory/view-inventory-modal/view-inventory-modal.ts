import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view-listing-modal',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './view-inventory-modal.html',
})
export class ViewListingModalComponent {
  @Input() listing: any;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  getPropertyTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      apartment: 'Apartment',
      house: 'House',
      villa: 'Villa',
      room: 'Room',
      hotel: 'Hotel',
      guesthouse: 'Guest House',
    };
    return labels[type] || type;
  }

  closeModal() {
    this.close.emit();
  }
}
