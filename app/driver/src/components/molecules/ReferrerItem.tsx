import React from 'react';
import {Avatar, Div, DivProps, Icon, Text} from 'react-native-magnus';

const avatarPlaceholder = require('@yuju/assets/images/avatar-placeholder.jpg');

interface ReferrerItemProps extends DivProps {
  avatar?: string;
  cost?: number;
  // number: number;
}

export const ReferrerItem: React.FC<ReferrerItemProps> = ({
  avatar,
  cost = 0,
  // number,
  ...rest
}) => {
  return (
    <Div
      flex={1}
      rounded="lg"
      p="lg"
      borderWidth={1}
      borderColor="gray200"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      {...rest}>
      <Div justifyContent="center" alignItems="center">
        <Avatar
          color="primary500"
          alignSelf="center"
          rounded="circle"
          bg="gray100"
          source={avatar ? {uri: avatar} : avatarPlaceholder}>
          <Div position="absolute" bottom={-2} right={-2}>
            <Div
              bg="green500"
              rounded="circle"
              w={20}
              h={20}
              alignItems="center"
              justifyContent="center">
              <Text fontWeight="500" color="green100" fontSize={8}>
                10
              </Text>
            </Div>
          </Div>

          <Icon
            color="primary500"
            fontSize="2xl"
            name="person"
            fontFamily="Ionicons"
          />
        </Avatar>
        <Text mt="lg" fontWeight="500" fontSize="xl">
          S/. {cost.toFixed(2)}
        </Text>
      </Div>
    </Div>
  );
};
