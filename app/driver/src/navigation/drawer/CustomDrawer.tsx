import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Separator} from '@yuju/components/atoms/Separator';
import {LogoutButton} from '@yuju/components/atoms/LogoutButton';
import {ShareAppButton} from '@yuju/components/atoms/ShareAppButton';
import {DrawerHeaderContent} from '@yuju/components/molecules/DrawerHeaderContent';
import {useAppVersion} from '@yuju/global-hooks/useAppVersion';

interface Props extends DrawerContentComponentProps {}

export const CustomDrawer: React.FC<Props> = props => {
  const appVersion = useAppVersion();

  return (
    <Div flex={1}>
      <DrawerContentScrollView {...props}>
        <Div p="xl" bgImg={require('@yuju/assets/images/bgplaceholder.png')}>
          <DrawerHeaderContent
            onAccountInactivePress={() =>
              props.navigation.navigate('ProfileStackScreen', {
                screen: 'ProfileScreen',
              })
            }
          />
        </Div>
        <Div flex={1} bg="#fff" px="lg">
          <DrawerItemList {...props} />
        </Div>
      </DrawerContentScrollView>

      <Separator />

      <Div p="xl">
        <ShareAppButton />

        <Div mt="lg" />

        <LogoutButton />

        <Div mt="2xl">
          <Text textAlign="center" fontSize={8} color="gray500">
            Yuju v{appVersion} • Por Shair
          </Text>
        </Div>
      </Div>
    </Div>
  );
};
