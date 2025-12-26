import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/services';

  getServiceStats(): Observable<{ success: boolean; data: { totalServices: number; growthPercentage: number; currentMonthCount: number; lastMonthCount: number } }> {
    return this.http.get<{ success: boolean; data: { totalServices: number; growthPercentage: number; currentMonthCount: number; lastMonthCount: number } }>(
      `${this.apiUrl}/stats`
    );
  }

  getServices(params?: { page?: number; limit?: number; search?: string }): Observable<any> {
    let queryParams = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      queryParams = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }
    return this.http.get<any>(`${this.apiUrl}${queryParams}`);
  }
}
