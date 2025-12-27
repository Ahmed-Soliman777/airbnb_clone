import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-listing-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-inventory-modal.html',
})
export class EditListingModalComponent implements OnChanges {
  @Input() listing: any = null;
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() errorMessage: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData: any = this.getEmptyFormData();

  propertyTypes = ['apartment', 'house', 'villa', 'room', 'hotel', 'guesthouse'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listing'] && this.listing) {
      this.formData = JSON.parse(JSON.stringify(this.listing));
    } else if (changes['isOpen'] && this.isOpen && !this.isEditMode) {
      this.formData = this.getEmptyFormData();
    }
  }

  getEmptyFormData() {
    return {
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      propertyType: '',
      pricePerNight: 0,
      cleaningFee: 0,
      maxGuests: 1,
      bedrooms: 0,
      bathrooms: 0,
      address: {
        street: '',
        city: '',
        country: '',
        coordinates: { lat: 0, lng: 0 },
      },
      hostId: '',
    };
  }

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

  saveListing() {
    this.save.emit(this.formData);
  }
}
