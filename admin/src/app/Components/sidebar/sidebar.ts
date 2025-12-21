import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/user';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() user: User | null = null;
  @Output() logoutClick = new EventEmitter<void>();

  onLogout(): void {
    this.logoutClick.emit();
  }
}
