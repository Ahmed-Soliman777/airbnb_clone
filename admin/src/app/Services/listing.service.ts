import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Listing, ListingResponse } from '../Models/listing';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/listings';

  getListings(params?: {
    page?: number;
    limit?: number;
    search?: string;
    propertyType?: string;
  }): Observable<ListingResponse> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.propertyType) httpParams = httpParams.set('propertyType', params.propertyType);

    return this.http.get<ListingResponse>(this.apiUrl, { params: httpParams });
  }

  getListing(id: string): Observable<{ success: boolean; data: Listing }> {
    return this.http.get<{ success: boolean; data: Listing }>(`${this.apiUrl}/${id}`);
  }

  createListing(listing: Partial<Listing>): Observable<{ success: boolean; data: Listing }> {
    return this.http.post<{ success: boolean; data: Listing }>(this.apiUrl, listing);
  }

  updateListing(
    id: string,
    listing: Partial<Listing>
  ): Observable<{ success: boolean; data: Listing }> {
    return this.http.put<{ success: boolean; data: Listing }>(`${this.apiUrl}/${id}`, listing);
  }

  deleteListing(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  getListingStats(): Observable<{
    success: boolean;
    data: {
      totalListings: number;
      growthPercentage: number;
      currentMonthCount: number;
      lastMonthCount: number;
    };
  }> {
    const url = `${this.apiUrl}/stats`;
    // console.log('Service: Making request to', url);
    return this.http.get<{
      success: boolean;
      data: {
        totalListings: number;
        growthPercentage: number;
        currentMonthCount: number;
        lastMonthCount: number;
      };
    }>(url);
    // .pipe(tap(response => console.log('Service: Received response', response)));
  }
}
