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
};

export interface GetMyProfile {
  user: {
    id: string;
    profile: Profile;
    availability: Availability;
    facebookId: string;
    facebookAccessToken: string;
    createdAt: string;
    updatedAt: string;
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
