import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar, Div, DivProps, Icon, Text} from 'react-native-magnus';
import TextTicker from 'react-native-text-ticker';
import {InRidePending} from '@yuju/mods/socket/stores/useSocketStore';
import {convertDistance, getDistance} from '@yuju/common/utils/location';

interface Props extends DivProps, InRidePending {
  onPress: () => void;
  disabled?: boolean;
}

export const PendingRideItem: React.FC<Props> = ({
  id,
  from,
  to,
  passengersQuantity,
  user,
  ridePrice,
  onPress,
  disabled = false,
  ...rest
}) => {
  const distance = getDistance(from.location, to.location);
  const convertedDistance = convertDistance(distance);

  return (
    <Div
      bg="gray50"
      mx="2xl"
      rounded="lg"
      borderWidth={1}
      borderColor="gray200"
      opacity={disabled ? 0.5 : 1}
      {...rest}>
      <TouchableOpacity
        onPress={onPress}
        disabled={false}
        style={{
          overflow: 'hidden',
          borderRadius: 8,
        }}
        activeOpacity={disabled ? 1 : 0.7}>
        <Div row p="lg">
          <Div mr="lg" alignItems="center" justifyContent="center">
            <Div
              borderWidth={2}
              borderColor="gray100"
              w={65}
              h={65}
              rounded="circle"
              alignItems="center"
              justifyContent="center"
              position="relative">
              <Avatar
                size={60}
                source={{uri: user.avatar}}
                bg="gray100"
                alignSelf="center"
              />
            </Div>

            <Text mt="sm">⭐ 5</Text>
            <Text mt="sm" textAlign="center" fontSize={6} color="gray500">
              hace 2 segundos
            </Text>
          </Div>
          <Div flex={1} justifyContent="space-between">
            <Text color="#000" fontWeight="700" fontSize="xl">
              {user.name}
            </Text>
            <Div mt="xs">
              <Text fontSize={10} color="gray500">
                Desde
              </Text>
              <TextTicker duration={5000} loop bounce>
                <Text fontWeight="500">{from.address}</Text>
              </TextTicker>
            </Div>
            <Div mt="xs">
              <Text fontSize={10} color="gray500">
                Hasta
              </Text>
              <TextTicker duration={5000} loop bounce>
                <Text fontWeight="500">{to.address}</Text>
              </TextTicker>
            </Div>
            <Div row mt="xs">
              <Text color="green500" fontWeight="bold" fontSize="lg">
                S/{ridePrice}
              </Text>
              <Div ml="lg" row>
                <Icon
                  fontFamily="Ionicons"
                  name={passengersQuantity > 1 ? 'people' : 'person'}
                  color="gray500"
                />
                <Text ml="xs" fontSize="lg" color="gray500">
                  {passengersQuantity}
                </Text>
              </Div>
              <Text ml="lg" fontSize="lg" color="gray500">
                ~{convertedDistance}.
              </Text>
            </Div>
          </Div>
        </Div>
      </TouchableOpacity>
    </Div>
  );
};
