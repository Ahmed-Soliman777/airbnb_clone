import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/profile`, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.removeToken();
          this.currentUserSubject.next(null);
        })
      );
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `token=${token}; path=/; SameSite=Lax`;
    }
  }

  getToken(): string | null {
    // Ensure this code only runs in the browser
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
