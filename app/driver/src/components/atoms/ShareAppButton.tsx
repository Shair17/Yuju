import React from 'react';
import {Button, Icon} from 'react-native-magnus';
import {useShareMyReferralCode} from '@yuju/global-hooks/useShareMyReferralCode';

export const ShareAppButton: React.FC = () => {
  const {handleShareMyReferralCode} = useShareMyReferralCode();

  return (
    <Button
      block
      px="xl"
      py="lg"
      bg="green500"
      underlayColor="green600"
      fontSize="lg"
      color="#fff"
      fontWeight="bold"
      onPress={handleShareMyReferralCode}
      rounded="lg"
      prefix={
        <Icon
          fontSize="2xl"
          fontFamily="Ionicons"
          name="share-social-outline"
          color="#fff"
          mr="md"
        />
      }>
      Invitar amigos
    </Button>
  );
};
