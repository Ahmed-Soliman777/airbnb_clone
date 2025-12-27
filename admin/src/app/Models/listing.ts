export interface Listing {
  _id?: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  propertyType: 'apartment' | 'house' | 'villa' | 'shared_room' | 'private_room';
  address: {
    street: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: Array<{
    url: string;
    caption: string;
  }>;
  amenities: string[];
  highlightFeatures: Array<{
    icon: string;
    title: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
  }>;
  hostId: string;
  reviews: string[];
  availability: Array<{
    startDate: Date;
    endDate: Date;
  }>;
  ratingAvg: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListingResponse {
  success: boolean;
  data: Listing[];
  total?: number;
  page?: number;
  limit?: number;
}
