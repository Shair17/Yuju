import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {openLink} from '@yuju/common/utils/link';
import {SHAIR_INSTAGRAM} from '@yuju/common/constants/app';

interface Props {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  fontSize?: number;
  linkToOpen?: string;
}

export const DevelopedByShair: React.FC<Props> = ({
  bottom = 10,
  left = undefined,
  right = undefined,
  top = undefined,
  fontSize = 6,
  linkToOpen = SHAIR_INSTAGRAM,
}) => {
  return (
    <Div
      position="absolute"
      bottom={bottom}
      top={top}
      left={left}
      right={right}
      alignSelf="center"
      alignItems="center">
      <Text
        fontSize={fontSize}
        color="gray700"
        onPress={() => openLink(linkToOpen)}>
        Desarrollado por{' '}
        <Text fontSize={fontSize} color="gray700" fontWeight="500">
          @shair.dev
        </Text>
        .
      </Text>
    </Div>
  );
};
