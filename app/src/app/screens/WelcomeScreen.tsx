import React from 'react';
import {StatusBar} from 'react-native';
import {Box, Text, Button} from '@yuju/modules/ui';

export const WelcomeScreen: React.FC = () => {
  return (
    <Box flex={1} bg="blue600">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        alignItems={'center'}
        justifyContent="center">
        <Text fontWeight="bold" color="white" fontSize={60}>
          Yuju
        </Text>
      </Box>

      <Box
        flex={1}
        mb={32}
        px={16}
        justifyContent="flex-end"
        alignItems="center">
        <Box mb={32}>
          <Text color="white" textAlign="center">
            Una mejor forma de transportarse
          </Text>

          <Text color="slate200" textAlign="center" fontSize={18}>
            Seguridad, confianza y rápidez en un solo lugar, con{' '}
            <Text color="white" fontWeight="bold">
              Yuju
            </Text>
            .
          </Text>
        </Box>

        <Button
          block
          bg="white"
          justifyContent="center"
          alignItems="center"
          h={55}
          px={16}
          py={8}
          rounded={12}>
          <Text color="blue600" fontWeight="500" fontSize={20}>
            Empezar
          </Text>
        </Button>
      </Box>
    </Box>
  );
};
