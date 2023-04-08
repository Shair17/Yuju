import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {MAX_TRIP_MESSAGE_LENGTH} from '@yuju/common/constants/app';

type TripStoreDefaultValues = {
  price: number;
  passengersCount: number;
  message?: string;
  currentAddress?: string;
};

const getDefaultValues = (): TripStoreDefaultValues => {
  return {
    price: 3,
    passengersCount: 1,
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
    setCurrentAddress: (
      currentAddress: TripStoreDefaultValues['currentAddress'],
    ) =>
      set({
        currentAddress,
      }),
  })),
);
