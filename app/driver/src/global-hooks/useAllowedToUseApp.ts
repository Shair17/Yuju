import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';

export const useAllowedToUseApp = (): boolean => {
  const allowedToUseApp = useSocketStore(s => s.allowedToUseApp);
  const inRide = useSocketStore(s => s.inRide);
  const inRidePending = useSocketStore(s => s.inRidePending);
  const isInRide = !!inRide;
  const isInRidePending = !!inRidePending;
  const isBusy = isInRide || isInRidePending;

  return isBusy ? true : allowedToUseApp;
};
