import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../Services/admin';
import { User } from '../../Models/user';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private Admin = inject(Admin);

  allUsers: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.Admin.getAllUsers().subscribe(data => {
      this.allUsers = data;
      this.filteredUsers = [...data]; 
      console.log(data, "data");
    });
  }

  applyFilter(role: string) {
    
    this.filteredUsers = (role === 'all')
      ? [...this.allUsers]
      : this.allUsers.filter(u => u.role === role);
  }

  deleteUser(id: string) {
  if (confirm('Are you sure delete this user')) {
    this.Admin.deleteUser(id).subscribe({
      next: (res) => {
        console.log('Delete response:', res);
        // allUsers and filteredUsers
        this.allUsers = this.allUsers.filter(u => u._id !== id);
        this.filteredUsers = this.filteredUsers.filter(u => u._id !== id);
      },
      error: (err) => console.error('Delete error:', err)
    });
  }
}

}
