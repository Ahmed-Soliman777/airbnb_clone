import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-inventory-header',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './inventory-header.html',
  styleUrls: ['./inventory-header.css'],
})
export class InventoryHeaderComponent {
  @Output() addNew = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  onAddNew() {
    this.addNew.emit();
  }

  onExport() {
    this.export.emit();
  }
}
