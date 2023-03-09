export const enum RootStackScreens {
  Home = 'HOME_SCREEN',
  Request = 'REQUEST_SCREEN',
  Profile = 'PROFILE_SCREEN',
}

export type ScreenValue =
  (typeof RootStackScreens)[keyof typeof RootStackScreens];
