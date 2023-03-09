import React, {FC} from 'react';
import {Image} from 'react-native-magnus';
import {miniGameImages} from '@yuju/mods/minigame/constants/minigame';

interface Props {}

export const PipeTop: FC<Props> = (props: any) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <Image
      position="absolute"
      left={x}
      top={y}
      w={width}
      h={height}
      resizeMode="stretch"
      source={miniGameImages.pipeTop}
    />
  );
};
