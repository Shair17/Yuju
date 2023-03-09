import React, {FC} from 'react';
import {Div, Image} from 'react-native-magnus';
import {miniGameImages} from '@yuju/mods/minigame/constants/minigame';

interface Props {}

export const Pipe: FC<Props> = (props: any) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const pipeRatio = 160 / width;
  const pipeHeight = 33 * pipeRatio;
  const pipeIterations = Math.ceil(height / pipeHeight);

  return (
    <Div
      position="absolute"
      left={x}
      top={y}
      w={width}
      h={height}
      overflow="hidden"
      flexDir="column">
      {Array.apply(null, Array(pipeIterations)).map((el, key) => (
        <Image
          key={key.toString()}
          w={width}
          h={pipeHeight}
          resizeMode="stretch"
          source={miniGameImages.pipeCore}
        />
      ))}
    </Div>
  );
};
