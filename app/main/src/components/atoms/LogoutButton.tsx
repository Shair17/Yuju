import React from 'react';
import {TouchableNativeFeedback} from 'react-native';
import {Div, Icon, Text} from 'react-native-magnus';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';

export const LogoutButton: React.FC = () => {
  const removeTokens = useAuthStore(s => s.removeTokens);
  const logOutFromYuju = useAuthStore(s => s.logOutFromYuju);

  const logout = async () => {
    removeTokens();
    await logOutFromYuju();
  };

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('#fee2e2', true)}
      onPress={logout}>
      <Div
        overflow="hidden"
        row
        rounded="lg"
        px="xl"
        py="lg"
        bg="red50"
        alignItems="center"
        justifyContent="space-between">
        <Div row>
          <Icon
            fontSize="4xl"
            fontFamily="Ionicons"
            name="log-out-outline"
            color="red500"
          />
          <Text ml="md" fontSize="lg" color="red500" fontWeight="bold">
            Cerrar Sesión
          </Text>
        </Div>
      </Div>
    </TouchableNativeFeedback>
  );
};
