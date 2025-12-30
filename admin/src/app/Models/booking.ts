// export interface Booking {
// }

export interface BookingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BookingListing {
  _id: string;
  title: string;
}

export interface Booking {
  _id: string;
  user: BookingUser;
  listing: BookingListing | null;
  service: BookingListing | null;
  experience: BookingListing | null;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
}

export interface UpdateBookingResponse {
  success: boolean;
  data: Booking;
}
