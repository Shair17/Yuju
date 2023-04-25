export interface MyEarnings {
  earnings: number;
}

export type TripStatus = 'Completed' | 'Pending' | 'Problem' | 'Cancelled';

export interface MyEarning {
  id: string;
  user: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  };
  driver: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  };
  passengersQuantity: number;
  price: number;
  from: {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  to: {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  rating: number;
  status: TripStatus;
  startTime: string;
  endTime: string;
  updatedAt: string;
  createdAt: string;
}

export interface UpdateVehicleResponse {
  modified: boolean;
}

export interface UpdateVehicleBody {
  plate: string;
  vehiclePhotos: string[];
}

export interface Report {
  id: string;
  title: string;
  description: string;
  extra: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyReportsActivityResponse {
  data: Report[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface MyRating {
  id: string;
  user: {
    id: string;
    profile: {
      name: string;
      avatar: string;
      phoneNumber: string | null;
      email: string | null;
    };
  };
  driver: {
    id: string;
    profile: {
      name: string;
      avatar: string;
      phoneNumber: string | null;
      email: string | null;
    };
  };
  comment: string | null;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyTripsActivityResponse {
  data: MyTrip[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface MyTrip {
  id: string;
  price: number;
  passengersQuantity: number;
  user: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  };
  driver: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  } | null;
  rating: number;
  from: {
    id: string;
    address: string | null;
    latitude: number;
    longitude: number;
  };
  to: {
    id: string;
    address: string | null;
    latitude: number;
    longitude: number;
  };
  status: 'Completed' | 'Pending' | 'Problem' | 'Cancelled';
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileResponse extends GetMyProfile {
  modified: boolean;
}

export interface UpdateProfileBody {
  avatar?: string;
  email: string;
  dni: string;
  phoneNumber: string;
  birthDate: string;
}

export interface CreateProfileResponse extends GetMyProfile {
  created: boolean;
}

export interface CreateProfileBody {
  avatar?: string;
  referredByCode?: string;
  email: string;
  dni: string;
  phoneNumber: string;
  birthDate: string;

  summary: string;

  //# Vehicle
  license: string[];
  propertyCard: string[];
  circulationCard: string[];
  technicalReview: string[];
  dniPhotos: string[];
  vehiclePhotos: string[];

  // Foto
  soat: string;

  plate: string;
}

export interface GetReferralsResponse {
  earn: number;
  myEarnings: number;
  maxReferrals: number;
  code: string;
  referrals: {
    id: string;
    name: string;
    avatar: string;
  }[];
  referredBy: {
    id: string;
    profile: {
      name: string;
      avatar: string;
    };
  } | null;
}

export interface ReferralCodeResponse {
  referralCode: string;
  driver: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface LoginWithFacebookResponse {
  accessToken: string;
  refreshToken: string;
  isNew: boolean;
}

export interface LoginWithFacebookBody {
  accessToken: string;
  userID: string;
}

export interface Profile {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  dni?: string;
  phoneNumber?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
  updatedAt: string;
  // This is Date type
  activationDate?: string;
  // This is Date type
  bannedUntil?: string;
}

export interface GetMyVehicle {
  id: string;
  summary: string;
  licenseVerified: boolean;
  propertyCardVerified: boolean;
  circulationCardVerified: boolean;
  technicalReviewVerified: boolean;
  soatVerified: boolean;
  plate: string;
  dniVerified: boolean;
  vehiclePhotos: string[];
}

export interface GetMyProfile {
  driver: {
    id: string;
    profile: Profile;
    summary: string;
    availability: Availability;
    isAdmin: boolean;
    facebookId: string;
    facebookAccessToken: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AppVersionResponse {
  server_name: string;
  server_version: string;
  app_name: string;
  app_version: string;
  app_developer: string;
  app_update_message: string;
  date: string;
}

export type CreateBugReportResponse = {
  created: boolean;
  report: any;
};

export type CreateBugReportBody = {
  title: string;
  description: string;
  extra?: string;
};
