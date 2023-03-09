import React from 'react';
import {Button, Div, Icon} from 'react-native-magnus';

interface Props {
  goToRequestScreen: () => void;
}

export const HomeScreenAskDriver: React.FC<Props> = ({goToRequestScreen}) => {
  return (
    <Div mt="lg">
      <Button
        block
        bg="primary500"
        rounded="lg"
        fontSize="2xl"
        color="#fff"
        fontWeight="bold"
        // textTransform="uppercase"
        alignItems="center"
        justifyContent="center"
        h={55}
        suffix={
          <Icon
            fontFamily="Ionicons"
            name="arrow-forward"
            fontSize="2xl"
            color="#fff"
            ml="xs"
          />
        }
        onPress={goToRequestScreen}>
        Solicitar Mototaxi
      </Button>
    </Div>
  );
};
