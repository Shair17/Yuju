import React, {FC} from 'react';
import {Div, Image} from 'react-native-magnus';
import {miniGameImages} from '@yuju/mods/minigame/constants/minigame';

interface Props {}

export const Floor: FC<Props> = (props: any) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const imageIterations = Math.ceil(width / height);

  return (
    <Div
      position="absolute"
      left={x}
      top={y}
      w={width}
      h={height}
      overflow="hidden"
      flexDir="row">
      {Array.apply(null, Array(imageIterations)).map((el, key) => (
        <Image
          key={key.toString()}
          w={height}
          h={height}
          resizeMode="stretch"
          source={miniGameImages.floor}
        />
      ))}
    </Div>
  );
};
