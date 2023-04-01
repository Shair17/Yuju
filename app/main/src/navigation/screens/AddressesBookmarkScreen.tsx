import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ProfileStackParams,
  ProfileStackParamsValue,
} from '../bottom-tabs/ProfileStackScreen';
import {FlashList} from '@shopify/flash-list';
import {usePagination} from '@yuju/global-hooks/usePagination';

interface Props
  extends NativeStackScreenProps<
    ProfileStackParams,
    'AddressesBookmarkScreen'
  > {}

export const AddressesBookmarkScreen: React.FC<Props> = ({navigation}) => {
  const {
    myData: myAddresses,
    isLoading,
    handleAddMoreItems,
  } = usePagination({
    url: '',
  });

  return (
    <Div bg="body">
      <Text>AddressesBookmarkScreen</Text>
    </Div>
  );
};
