import {toRadians} from './number';
import {ILocation} from '@yuju/global-hooks/useLocation';

export const getDistance = (
  startLocation: ILocation,
  endLocation: ILocation,
) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(endLocation.latitude - startLocation.latitude);
  const dLon = toRadians(endLocation.longitude - startLocation.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(startLocation.latitude)) *
      Math.cos(toRadians(endLocation.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distancia en km

  return distance;
};

export const convertDistance = (distance: number) => {
  if (distance >= 1) {
    return distance.toFixed(2) + ' km';
  } else {
    return (distance * 1000).toFixed() + ' m';
  }
};
