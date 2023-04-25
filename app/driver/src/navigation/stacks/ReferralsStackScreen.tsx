import React from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParams} from '../drawer/Root';
import {ReferralsScreen} from '../screens/ReferralsScreen';
import {MyReferralsScreen} from '../screens/MyReferralsScreen';

export type ReferralsStackParams = {
  ReferralsScreen: undefined;
  MyReferralsScreen: undefined;
};

export type ReferralsStackParamsValue = keyof ReferralsStackParams;

const ReferralsStack = createNativeStackNavigator<ReferralsStackParams>();

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'ReferralsStackScreen'> {}

export const ReferralsStackScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();

  return (
    <ReferralsStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors?.body,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
        animation: 'fade_from_bottom',
      }}>
      <ReferralsStack.Screen
        name="ReferralsScreen"
        component={ReferralsScreen}
        options={{title: 'Referidos'}}
      />
      <ReferralsStack.Screen
        name="MyReferralsScreen"
        component={MyReferralsScreen}
        options={{title: 'Mis Referidos'}}
      />
    </ReferralsStack.Navigator>
  );
};
