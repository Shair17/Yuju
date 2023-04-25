import React from 'react';
import {Div, DivProps} from 'react-native-magnus';
import {MyRating} from '@yuju/types/app';

interface Props extends DivProps, MyRating {}

export const MyRatingScreenRatingItem: React.FC<Props> = ({
  id,
  user,
  driver,
  comment,
  value,
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
