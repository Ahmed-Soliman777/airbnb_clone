import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Home } from './Components/home/home';
import { adminGuard } from './Guard/admin-guard';
import { AdminPaymentsComponent } from './Components/chart/chart';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [adminGuard] },
  { path: 'payments', component: AdminPaymentsComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/login' },
];
