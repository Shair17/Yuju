import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {MAX_TRIP_MESSAGE_LENGTH} from '@yuju/common/constants/app';
import {ILocation} from '@yuju/global-hooks/useLocation';

type TripStoreDefaultValues = {
  price: number;
  passengersCount: number;
  message?: string;
  fromAddress?: string;

  toLocation: ILocation;
  toAddress?: string;
};

const getDefaultValues = (): TripStoreDefaultValues => {
  return {
    price: 3,
    passengersCount: 1,
    toLocation: {
      latitude: 0,
      longitude: 0,
    },
  };
};

export const useTripStore = create(
  combine(getDefaultValues(), (set, get) => ({
    setPrice: (price: TripStoreDefaultValues['price']) =>
      set({
        price,
      }),
    setPassengersCount: (
      passengersCount: TripStoreDefaultValues['passengersCount'],
    ) =>
      set({
        passengersCount,
      }),
    setMessage: (message: TripStoreDefaultValues['message']) => {
      if (message && message.length > MAX_TRIP_MESSAGE_LENGTH) return;

      set({
        message,
      });
    },
    setFromAddress: (fromAddress: TripStoreDefaultValues['fromAddress']) =>
      set({
        fromAddress,
      }),
    setToAddress: (toAddress: TripStoreDefaultValues['toAddress']) =>
      set({
        toAddress,
      }),
    setToLocation: (toLocation: TripStoreDefaultValues['toLocation']) =>
      set({
        toLocation,
      }),
  })),
);
