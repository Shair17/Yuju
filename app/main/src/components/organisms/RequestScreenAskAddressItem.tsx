import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Div, Text, DivProps} from 'react-native-magnus';

interface Props extends DivProps {
  leftIcon: React.ReactElement;
  onLocationInputPress: () => void;
  locationInputLabel: string;
  locationValue: string;
}

export const RequestScreenAskAddressItem: React.FC<Props> = ({
  leftIcon,
  locationInputLabel,
  locationValue,
  onLocationInputPress,
  ...divProps
}) => {
  return (
    <Div row justifyContent="space-between" {...divProps}>
      <Div alignItems="center" justifyContent="center" mr="md">
        {leftIcon}
      </Div>
      <Div flex={1}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onLocationInputPress}
          style={{borderRadius: 8}}>
          <Div overflow="hidden" bg="gray100" rounded="lg" px="md" py="sm">
            <Text fontSize={10} fontWeight="500" color="gray400">
              {locationInputLabel}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="#000"
              numberOfLines={1}>
              {locationValue}
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  );
};
