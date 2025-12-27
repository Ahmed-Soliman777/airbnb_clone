import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-listing-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-inventory-modal.html',
})
export class DeleteListingModalComponent {
  @Input() listing: any;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  confirmDelete() {
    this.confirm.emit();
  }
}
