import React, {FC} from 'react';
import {Text, TextProps} from '@yuju/modules/yuju-ui';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  text: string;
  textProps?: TextProps;
  colors: string[];
  start?: {x: number; y: number};
  end?: {x: number; y: number};
}

export const LinearGradientText: FC<Props> = props => {
  const {
    text,
    textProps = {},
    colors,
    start = {x: 0, y: 1},
    end = {x: 1, y: 1},
  } = props;

  return (
    <MaskedView
      maskElement={
        <Text sx={{backgroundColor: 'transparent'}} {...textProps}>
          {text}
        </Text>
      }>
      <LinearGradient colors={colors} start={start} end={end}>
        <Text sx={{opacity: 0}} {...textProps}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};
