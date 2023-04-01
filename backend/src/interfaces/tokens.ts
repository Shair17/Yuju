export type AuthTokenType = 'user' | 'driver';

export type AuthTokenPayload = {
  id: string;
  facebookId: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  dni: string | null;
  avatar: string;
  isAdmin: boolean;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
