import React from 'react';
import {Div, Icon, Text, DivProps} from 'react-native-magnus';
import {useSocketIsDriverOnline} from '@yuju/mods/socket/hooks/useSocketIsDriverOnline';

interface Props extends DivProps {
  id: string;
  profile: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const DriversBookMarkScreenDriverItem: React.FC<Props> = ({
  id,
  profile,
  rating,
  createdAt,
  updatedAt,
  ...props
}) => {
  const isOnline = useSocketIsDriverOnline(id);

  console.log({isOnline});

  return (
    <Div
      mt="lg"
      row
      bg="gray50"
      rounded="lg"
      p="lg"
      alignItems="center"
      {...props}></Div>
  );
};
