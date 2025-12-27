import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-table.html',
  styleUrls: ['./inventory-table.css'],
})
export class InventoryTableComponent {
  @Input() listings: any[] = [];
  @Input() isLoading: boolean = false;

  @Output() viewListing = new EventEmitter<any>();
  @Output() editListing = new EventEmitter<any>();
  @Output() deleteListing = new EventEmitter<any>();

  onView(listing: any) {
    this.viewListing.emit(listing);
  }

  onEdit(listing: any) {
    this.editListing.emit(listing);
  }

  onDelete(listing: any) {
    this.deleteListing.emit(listing);
  }

  getItemImage(listing: any): string {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    return 'assets/placeholder.jpg';
  }

  getItemTypeLabel(listing: any): string {
    return listing.itemType
      ? listing.itemType.charAt(0).toUpperCase() + listing.itemType.slice(1)
      : 'N/A';
  }

  getItemPrice(listing: any): string {
    if (listing.price) {
      return `$${listing.price}`;
    }
    if (listing.pricePerNight) {
      return `$${listing.pricePerNight}/night`;
    }
    if (listing.pricePerPerson) {
      return `$${listing.pricePerPerson}/person`;
    }
    return 'N/A';
  }
}
