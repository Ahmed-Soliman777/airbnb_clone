export interface Experience {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  experienceType: string;
  location: {
    street?: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricePerPerson: number;
  duration: string;
  groupSize: {
    min: number;
    max: number;
  };
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  ageRequirement?: string;
  fitnessLevel?: string;
  requirements: string[];
  images: {
    url: string;
    alt: string;
  }[];
  inclusions: string[];
  host: string;
  status: 'draft' | 'pending' | 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
