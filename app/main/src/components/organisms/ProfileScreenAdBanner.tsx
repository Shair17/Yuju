import React from 'react';
import {Div} from 'react-native-magnus';
import {ProfileSettingTitle} from '@yuju/components/atoms/ProfileSettingTitle';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3125447360428057/6805817319';

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
