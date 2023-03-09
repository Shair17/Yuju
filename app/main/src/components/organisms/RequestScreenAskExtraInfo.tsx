import React from 'react';
import {Div, Text} from 'react-native-magnus';

interface Props {
  title: string;
  subtitle: string;
}

export const RequestScreenAskExtraInfo: React.FC<Props> = ({
  subtitle,
  title,
}) => {
  return (
    <Div flex={1} justifyContent="center">
      <Text fontSize="xl" fontWeight="bold" color="gray900">
        {title}
      </Text>
      <Text fontSize={8} color="gray500">
        {subtitle}
      </Text>
    </Div>
  );
};
