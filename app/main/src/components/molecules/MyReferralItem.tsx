import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Avatar, Div, Text} from 'react-native-magnus';

interface Props {
  id: string;
  avatar: string;
  name: string;
}

export const MyReferralItem: React.FC<Props> = ({avatar, id, name}) => {
  return (
    <Div mt="lg">
      <TouchableOpacity activeOpacity={0.7}>
        <Div
          row
          alignItems="center"
          rounded="lg"
          p="lg"
          borderWidth={1}
          borderColor="gray200">
          <Avatar
            color="primary500"
            alignSelf="center"
            rounded="circle"
            bg="gray100"
            size={60}
            source={{uri: avatar}}
          />
          <Div ml="md">
            <Text
              fontSize="xl"
              color="gray900"
              fontWeight="bold"
              numberOfLines={1}>
              {name}
            </Text>
            <Text fontSize="xs" color="gray400" numberOfLines={1}>
              ID: {id.substring(0, 8)}...
            </Text>
          </Div>
        </Div>
      </TouchableOpacity>
    </Div>
  );
};
