export const SHAIR_EMAIL = 'hello@shair.dev';
export const SHAIR_FACEBOOK_ID = '...';

export const serverHost = '0.0.0.0';
export const serverName = 'Yuju-Shair@Server-Root/Main';
export const serverVersion = '1.0';

export const appDeveloper = 'Shair <hello@shair.dev>';
export const appName = 'Yuju Perú 🐂⚡';
export const appVersion = '1.0';

// V.x.x -> major updates
// x.V.x -> minor updates
// x.x.V -> patch updates
export const appUpdateNeeded =
  +serverVersion.split('.')[0] > +appVersion.split('.')[0];

export const appUpdateMessage =
  'Por favor actualiza Yuju para tener una mejor experiencia!';

export const defaultAvatarUri =
  'https://res.cloudinary.com/fastly-delivery-app-peru/image/upload/v1625622757/defaults/avatars/fastly_default_wqjsjw.jpg';

export const MAX_REFERRAL_CODE_LENGTH = 6;

export const MAXIMUM_EARNINGS_FOR_REFERRALS = 5;

export const MAXIMUM_REFERRALS = 10;

export const DEFAULT_PAGE_PAGINATION = 1;
export const MAX_ITEMS_PER_PAGE_PAGINATION = 10;
