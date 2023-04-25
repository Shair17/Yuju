import React from 'react';
import {Div, Text} from 'react-native-magnus';

interface Props {
  title: string;
  subtitle: string;
}

export const AskScreenHeadingTitle: React.FC<Props> = ({subtitle, title}) => {
  return (
    <Div>
      <Text fontWeight="bold" color="text" fontSize="5xl">
        {title}
      </Text>
      <Text mt="md" fontSize="lg" color="gray700">
        {subtitle}
      </Text>
    </Div>
  );
};
