import React from 'react';
import {Div, Text} from 'react-native-magnus';

interface Props {
  title: string;
  content: string;
}

export const FAQItem: React.FC<Props> = ({title, content}) => {
  return (
    <Div mt="md" rounded="lg" p="xl" bg="gray200">
      <Text textAlign="left" fontSize="2xl" color="gray700" fontWeight="bold">
        {title}
      </Text>

      <Text fontSize="lg" mt="md">
        {content}
      </Text>
    </Div>
  );
};
