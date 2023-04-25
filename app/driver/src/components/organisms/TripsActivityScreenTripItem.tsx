import React from 'react';
import {Div, DivProps} from 'react-native-magnus';

interface Props extends DivProps {
  id: string;
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
}

export const TripsActivityScreenTripItem: React.FC<Props> = ({
  id,
  passengersQuantity,
  user,
  driver,
  rating,
  from,
  to,
  status,
  startTime,
  endTime,
  createdAt,
  updatedAt,
  ...props
}) => {
  return (
    <Div
      mt="lg"
      row
      bg="gray50"
      rounded="lg"
      p="lg"
      alignItems="center"
      {...props}
    />
  );
};
