import React from 'react';
import {TouchableNativeFeedback} from 'react-native';
import {Div, Icon, Text} from 'react-native-magnus';

interface Props {
  title: string;
  iconName: string;
  onPress: () => void;
}

export const ProfileSettingItem: React.FC<Props> = ({
  iconName,
  onPress,
  title,
}) => {
  return (
    <Div flex={1} mt="md" rounded="lg" overflow="hidden">
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#d4d4d8', true)}>
        <Div
          overflow="hidden"
          row
          rounded="lg"
          px="xl"
          py="lg"
          bg="gray200"
          alignItems="center"
          justifyContent="space-between">
          <Div row>
            <Icon
              fontSize="4xl"
              fontFamily="Ionicons"
              name={iconName}
              color="gray700"
            />
            <Text ml="md" fontSize="lg" color="gray700" fontWeight="bold">
              {title}
            </Text>
          </Div>
          <Div>
            <Icon
              fontSize="4xl"
              fontFamily="Ionicons"
              name="chevron-forward"
              color="gray700"
            />
          </Div>
        </Div>
      </TouchableNativeFeedback>
    </Div>
  );
};
