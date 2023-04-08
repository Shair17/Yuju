export interface Notification {
  id: string;
  title: string;
  description: string;
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

export type Profile = {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  dni?: string;
  phoneNumber?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type Availability = {
  id: string;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
  updatedAt: string;
  // This is Date type
  activationDate?: string;
  // This is Date type
  bannedUntil?: string;
};

export interface GetMyProfile {
  user: {
    id: string;
    profile: Profile;
    availability: Availability;
    isAdmin: boolean;
    facebookId: string;
    facebookAccessToken: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MyDriverProfile {
  driver: {
    id: string;
    name: string;
    avatar: string;
    createdAt: string;
    summary: string;
    completedTrips: number;
    rankingsTotal: number;
    vehiclesPhotos: string[];
    rankings: {
      id: string;
      comment: string | null;
      value: number;
      createdAt: string;
      user: {
        id: string;
        avatar: string;
        name: string;
      };
    }[];
    rankingsAverage: number;
  };
  user: {
    id: string;
    name: string;
  };
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

export type MyTrip = {
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
};

export type MyTripsActivityResponse = {
  data: MyTrip[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export interface CreateAddressResponse {
  success: boolean;
  id: string;
  addresses: GetMyAddressesResponse['addresses'];
  created: boolean;
}

export interface CreateAddressBody {
  name: string;
  address: string;
  zip: string;
  city: string;
  tag: TagType;
  latitude: number;
  longitude: number;
}

export type TagType =
  | 'Casa'
  | 'Amigo'
  | 'Pareja'
  | 'Trabajo'
  | 'Universidad'
  | 'Otro';

export type MyAddress = {
  id: string;
  address: string | null;
  name: string | null;
  zip: string | null;
  city: string | null;
  tag: TagType;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
};

export type GetMyAddressesResponse = {
  addresses: MyAddress[];
};

export type MyDriver = {
  id: string;
  profile: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type MyDriversResponse = {
  data: MyDriver[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  extra: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MyReportsActivityResponse = {
  data: Report[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export type CreateProfileResponse = {
  created: boolean;
} & GetMyProfile;

export type CreateProfileBody = {
  avatar?: string;
  referredByCode?: string;
  email: string;
  dni: string;
  phoneNumber: string;
  birthDate: string;
};

export type UpdateProfileResponse = {
  modified: boolean;
} & GetMyProfile;

export type UpdateProfileBody = {
  avatar?: string;
  email: string;
  dni: string;
  phoneNumber: string;
  birthDate: string;
};

export type LoginWithFacebookResponse = {
  accessToken: string;
  refreshToken: string;
  isNew: boolean;
};

export type LoginWithFacebookBody = {
  accessToken: string;
  userID: string;
};

export type CreateBugReportResponse = {
  created: boolean;
  report: any;
};

export type CreateBugReportBody = {
  title: string;
  description: string;
  extra?: string;
};
