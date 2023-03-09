import React from 'react';
import {Text} from 'react-native-magnus';

interface Props {
  title: string;
}

export const ProfileSettingTitle: React.FC<Props> = ({title}) => {
  return (
    <Text fontWeight="500" color="gray500">
      {title}
    </Text>
  );
};
