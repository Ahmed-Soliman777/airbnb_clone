import {
  Component,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser,
  TitleCasePipe,
  DatePipe,
  CurrencyPipe,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AdminPaymentsService } from '../../Services/admin-payments';
import { DailyPaymentStat } from '../../Models/payment-stats';
import { Booking } from '../../Models/booking';

interface DisplayBooking extends Booking {
  displayName: string;
  displayEmail: string;
  listingTitle: string;
  previousStatus: 'pending' | 'confirmed' | 'cancelled';
}

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, TitleCasePipe, DatePipe, CurrencyPipe],
  templateUrl: './chart.html',
})
export class AdminPaymentsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  isBrowser = false;

  // Chart data
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Confirmed',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [],
        label: 'Pending',
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [],
        label: 'Cancelled',
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Total Amount ($)',
        },
        beginAtZero: true,
      },
    },
  };

  // Table data
  bookings: DisplayBooking[] = [];
  isLoading = true;
  isUpdating: string | null = null;
  errorMessage: string | null = null;

  statusOptions: ('pending' | 'confirmed' | 'cancelled')[] = ['pending', 'confirmed', 'cancelled'];

  constructor(private adminPaymentsService: AdminPaymentsService) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.markForCheck();

    // Load chart data
    this.adminPaymentsService.getDailyPaymentStats().subscribe({
      next: (response) => {
        console.log('Stats loaded:', response);
        this.processChartData(response.data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.errorMessage = 'Failed to load payment statistics';
        this.cdr.markForCheck();
      },
    });

    // Load table data
    this.adminPaymentsService.getAllBookings().subscribe({
      next: (response) => {
        console.log('Bookings loaded:', response);
        this.bookings = response.data.map((booking) => this.mapToDisplayBooking(booking));
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private mapToDisplayBooking(booking: Booking): DisplayBooking {
    return {
      ...booking,
      displayName: this.getDisplayName(booking),
      displayEmail: booking.user?.email || 'No email',
      listingTitle: this.getListingTitle(booking),
      previousStatus: booking.status,
    };
  }

  private getDisplayName(booking: Booking): string {
    if (!booking.user) {
      return 'Unknown User';
    }
    if (booking.user.firstName || booking.user.lastName) {
      return `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim();
    }
    return booking.user.email || 'Unknown';
  }

  private getListingTitle(booking: Booking): string {
    if (booking.listing) {
      return booking.listing.title || 'Untitled Listing';
    }
    if (booking.service) {
      return `[Service] ${booking.service.title || 'Untitled'}`;
    }
    if (booking.experience) {
      return `[Experience] ${booking.experience.title || 'Untitled'}`;
    }
    return 'N/A';
  }

  processChartData(stats: DailyPaymentStat[]): void {
    const labels: string[] = [];
    const confirmedData: number[] = [];
    const pendingData: number[] = [];
    const cancelledData: number[] = [];

    for (const stat of stats) {
      labels.push(stat.date);

      let confirmed = 0;
      let pending = 0;
      let cancelled = 0;

      for (const statusData of stat.statuses) {
        if (statusData.status === 'confirmed') {
          confirmed = statusData.totalAmount;
        } else if (statusData.status === 'pending') {
          pending = statusData.totalAmount;
        } else if (statusData.status === 'cancelled') {
          cancelled = statusData.totalAmount;
        }
      }

      confirmedData.push(confirmed);
      pendingData.push(pending);
      cancelledData.push(cancelled);
    }

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: confirmedData,
          label: 'Confirmed',
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          data: pendingData,
          label: 'Pending',
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          data: cancelledData,
          label: 'Cancelled',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  // Store the previous status before change
  onStatusFocus(booking: DisplayBooking): void {
    booking.previousStatus = booking.status;
  }

  onStatusChange(booking: DisplayBooking, newStatus: 'pending' | 'confirmed' | 'cancelled'): void {
    const previousStatus = booking.previousStatus;

    // If same status, do nothing
    if (previousStatus === newStatus) {
      return;
    }

    this.isUpdating = booking._id;
    this.cdr.markForCheck();

    console.log('Updating booking:', booking._id, 'from', previousStatus, 'to', newStatus);

    this.adminPaymentsService.updateBookingStatus(booking._id, newStatus).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        booking.status = response.data.status;
        booking.previousStatus = response.data.status;
        this.isUpdating = null;
        this.cdr.markForCheck();

        // Reload chart data to reflect changes
        this.adminPaymentsService.getDailyPaymentStats().subscribe({
          next: (statsResponse) => {
            console.log('Chart data refreshed:', statsResponse);
            this.processChartData(statsResponse.data);
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error refreshing chart:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error updating status:', error);
        // Rollback to previous status
        booking.status = previousStatus;
        this.isUpdating = null;
        this.errorMessage = `Failed to update booking status: ${
          error.error?.message || error.message || 'Unknown error'
        }`;
        this.cdr.markForCheck();
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }
}
