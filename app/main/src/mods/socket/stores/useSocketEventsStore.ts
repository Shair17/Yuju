import {create} from 'zustand';
import {combine} from 'zustand/middleware';

interface Location {
  latitude: number;
  longitude: number;
}

interface BaseUser {
  id: string;
  facebookId: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  dni: string | null;
  avatar: string;
}

interface Driver extends BaseUser {
  location: Location;
}

interface User extends BaseUser {
  location: Location;
}

interface CurrentRide {
  id: string;
  user: User;
  driver: Driver;
  currentLocation: Location;
  trackingCode: string;
  from: {
    address?: string;
    location: Location;
  };
  to: {
    address?: string;
    location: Location;
  };
  passengersQuantity: number;
  ridePrice: number;
}

type SocketEventsValues = {
  currentRide: CurrentRide | null;
  // se usará para trackear el viaje de alguien más, por ejemplo tu amigo te pasó su código y así...
  trackingRide: CurrentRide | null;
  availableDrivers: Driver[];
};

const getDefaultValues = (): SocketEventsValues => {
  return {
    currentRide: null,
    trackingRide: null,
    availableDrivers: [],
  };
};

// Stores values for socket events, it's usually booleans, objects, arrays and strings...
// Only data that app can interact

export const useSocketEventsStore = create(
  combine(getDefaultValues(), (set, get) => ({
    setAvailableDrivers: (availableDrivers: Driver[]) =>
      set({availableDrivers}),
    setCurrentRide: (currentRide: CurrentRide | null) => set({currentRide}),
    setTrackingRide: (trackingRide: CurrentRide | null) => set({trackingRide}),
  })),
);
