import React from 'react';
import {Text} from 'react-native-magnus';

interface Props {
  title: string;
}

export const FAQTitle: React.FC<Props> = ({title}) => {
  return (
    <Text fontWeight="500" color="gray500" fontSize="lg">
      {title}
    </Text>
  );
};
