import React from 'react';
import {Box, Text} from '@yuju/modules/yuju-ui';
import {Chase as Spinner} from 'react-native-animated-spinkit';
import {LinearGradientText} from '@yuju/shared/components/LinearGradientText';
import {type NativeStackScreenProps} from '@react-navigation/native-stack';
import {type RootStackParamsList} from '../navigation/Root';

export const LoadingScreen: React.FC<
  NativeStackScreenProps<RootStackParamsList, 'LoadingScreen'>
> = () => {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box sx={{position: 'absolute', bottom: 24}}>
        <Text
        // fontSize="xs"
        // color="neutral500"
        >
          No compres, ¡alquila!
        </Text>
      </Box>

      <Box
        sx={{alignItems: 'center', justifyContent: 'center'}}
        // mb="lg"
      >
        <LinearGradientText
          colors={['#3b82f6', '#8b5cf6', '#a855f7', '#06b6d4', '#06b6d4']}
          text="Rentit"
          start={{x: 0.5, y: 0}}
          end={{x: 1, y: 1}}
          textProps={{
            // fontSize: '4xl',
            style: {fontSize: 40, fontWeight: 'bold'},
          }}
        />
      </Box>

      <Spinner size={35} color="#60a5fa" />
    </Box>
  );
};
