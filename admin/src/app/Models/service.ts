export interface Service {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  serviceCategory: string;
  location: {
    serviceArea?: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  hourlyRate: number;
  packages: {
    name: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
    price: number;
    duration: string;
  }[];
  availability: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  requirements: string[];
  skills: string[];
  images: {
    url: string;
    alt: string;
  }[];
  serviceDetails: {
    responseTime?: string;
    cancellationPolicy?: string;
    additionalInfo?: string;
  };
  host: string;
  status: 'draft' | 'pending' | 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
