import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './Services/auth-service';
import { User } from './Models/user';
import { Sidebar } from './Components/sidebar/sidebar';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Sidebar, /*MatSlideToggleModule*/],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('admin');
  user = signal<User | null>(null);
  currentRoute = signal<string>('');

  showSidebar = computed(() => {
    const route = this.currentRoute();
    return route !== '/login' && route !== '/';
  });

  constructor(private authService: AuthService, private router: Router) {
    //prevent user navigation to login page if already logged in
    this.authService.initAuth();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });

    this.authService.currentUser$.subscribe(user => {
      this.user.set(user);
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
