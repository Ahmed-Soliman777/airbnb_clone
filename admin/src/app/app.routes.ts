import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Home } from './Components/home/home';
import { Inventory } from './Components/inventory/inventory';
import { adminGuard } from './Guard/admin-guard';
import { AdminPaymentsComponent } from './Components/chart/chart';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [adminGuard] },
  { path: 'bookings', component: AdminPaymentsComponent, canActivate: [adminGuard] },
  { path: 'inventory', component: Inventory, canActivate: [adminGuard] },
  { path: 'users', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/home' },
];
