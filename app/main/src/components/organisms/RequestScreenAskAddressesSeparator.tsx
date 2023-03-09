import React from 'react';
import {Div} from 'react-native-magnus';

export const RequestScreenAskAddressesSeparator: React.FC = () => {
  return (
    <Div
      left={11.5}
      position="absolute"
      h="100%"
      alignItems="center"
      justifyContent="center">
      <Div
        w={1}
        borderWidth={1}
        borderColor="gray200"
        h="20%"
        rounded="circle"
      />
    </Div>
  );
};
