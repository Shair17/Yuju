import React, {FC} from 'react';
import {Animated} from 'react-native';
import {miniGameImages} from '@yuju/mods/minigame/constants/minigame';

interface Props {
  body: {
    velocity: {
      x: number;
      y: number;
    };
    bounds: {
      min: {
        x: number;
        y: number;
      };
      max: {
        x: number;
        y: number;
      };
    };
    position: {
      x: number;
      y: number;
    };
  };
  pose: number;
}

export const Bird: FC<Props> = ({body, pose}) => {
  const animatedValue = new Animated.Value(body.velocity.y);
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  animatedValue.setValue(body.velocity.y);

  const rotation = animatedValue.interpolate({
    inputRange: [-10, 0, 10, 20],
    outputRange: ['-20deg', '0deg', '15deg', '45deg'],
    extrapolate: 'clamp',
  });

  const image = miniGameImages[('bird' + pose) as keyof typeof miniGameImages];

  return (
    <Animated.Image
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        transform: [{rotate: rotation}],
      }}
      resizeMode="stretch"
      source={image}
    />
  );
};
