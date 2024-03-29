import React from 'react';
import {StatusBar} from 'react-native';
import {Box, Text, useYujuTheme, H1, P, Pressable} from '@yuju/modules/yuju-ui';

export const WelcomeScreen: React.FC = () => {
  const {theme} = useYujuTheme();

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: '$primary',
      }}>
      <StatusBar
        backgroundColor={theme.colors.$primary}
        barStyle="light-content"
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text sx={{color: 'white', fontWeight: 'bold', fontSize: '$6xl'}}>
          Yuju
        </Text>
      </Box>

      <Box
        sx={{
          flex: 1,
          paddingHorizontal: '$3',
          mb: '$4',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <Box sx={{mb: '$4'}}>
          <H1 sx={{color: 'white', textAlign: 'center'}}>
            Una mejor forma de transportarse
          </H1>

          <P
            sx={{
              color: 'slate200',
              fontSize: '$lg',
              textAlign: 'center',
            }}>
            Seguridad, confianza y rápidez en un solo lugar, con{' '}
            <Text sx={{color: 'white', fontWeight: 'bold'}}>Yuju</Text>.
          </P>
        </Box>

        <Pressable
          sx={{
            width: '100%',
            bg: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            height: 55,
            paddingHorizontal: '$3',
            paddingVertical: '$2',
            borderRadius: '$xl',
          }}
          onPress={() => {
            console.log('adsadsa');
          }}>
          <Text sx={{color: '$primary', fontWeight: '500', fontSize: '$xl'}}>
            Empezar
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};
