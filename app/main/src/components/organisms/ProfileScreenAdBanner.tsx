import React from 'react';
import {Div, Text, Skeleton, Image, Button} from 'react-native-magnus';
import {ProfileSettingTitle} from '@yuju/components/atoms/ProfileSettingTitle';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-1863951032999492/4035842496';

export const ProfileScreenAdBanner = () => {
  return (
    <Div mb="lg">
      <ProfileSettingTitle title="Anuncio" />

      <Div mt="md" alignItems="center" justifyContent="center">
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.MEDIUM_RECTANGLE}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </Div>
    </Div>
  );
};

/* <Div
    style={{display: 'none'}}
    rounded="lg"
    px="xl"
    py="lg"
    borderWidth={1}
    borderColor="gray200"
    // shadow="xs"
    // bg="#fff"
    alignItems="center"
    justifyContent="space-between"
    mt="md"
    overflow="hidden"
    flex={1}
    row>
    <Div flex={2}>
      <Image
        flex={1}
        source={require('@yuju/assets/images/rocket.png')}
        resizeMode="contain"
      />
    </Div>
    <Div flex={3}>
      <Text mb="sm" fontSize="xl" fontWeight="bold" color="gray500">
        Yuju Pro 😎
      </Text>

      <Text mb="sm" color="gray500">
        Go Pro and unlock all the benefits and assets!
      </Text>

      <Button rounded="lg" block fontWeight="bold">
        Subir a Premium
      </Button>
    </Div>
  </Div> */
