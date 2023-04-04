import React from 'react';
import {ScrollView} from 'react-native';
import {Div, Text} from 'react-native-magnus';

export const HomeScreenWhereToGo: React.FC = () => {
  return (
    <Div mt="lg">
      <Text fontSize="2xl" fontWeight="bold">
        ¿A dónde iremos hoy?
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{marginTop: 8}}>
        <Div w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
        <Div ml="md" w={180} h={180} bg="primary500" rounded="lg" />
      </ScrollView>
    </Div>
  );
};
