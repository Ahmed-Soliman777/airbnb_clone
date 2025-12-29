// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class AdminPayments {

// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentStatsResponse } from '../Models/payment-stats';
import { BookingsResponse, UpdateBookingResponse } from '../Models/booking';

@Injectable({
  providedIn: 'root',
})
export class AdminPaymentsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDailyPaymentStats(): Observable<PaymentStatsResponse> {
    return this.http.get<PaymentStatsResponse>(`${this.apiUrl}/booking/admin/stats`, {
      withCredentials: true,
    });
  }

  getAllBookings(): Observable<BookingsResponse> {
    return this.http.get<BookingsResponse>(`${this.apiUrl}/booking/admin/all`, {
      withCredentials: true,
    });
  }

  updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ): Observable<UpdateBookingResponse> {
    return this.http.patch<UpdateBookingResponse>(
      `${this.apiUrl}/booking/update/${bookingId}`,
      { status },
      { withCredentials: true }
    );
  }
}
