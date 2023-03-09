import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {RecommendItem} from '../molecules/RecommendItem';

export const HomeScreenRecommended: React.FC = () => {
  // use swr to get recommended places here...

  return (
    <Div mt="lg">
      <Text fontSize="2xl" fontWeight="bold">
        Recomendaciones
      </Text>
      <Div mt="md">
        <Div row>
          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/bowl.png')}
            mr="md"
            title="Cafetería"
          />

          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/hamburger.png')}
            mr="md"
            title="Restaurante"
          />

          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/fashion.png')}
            mr="md"
            title="Ropa"
          />

          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/make-up.png')}
            title="Moda"
          />
        </Div>

        <Div row mt="md">
          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/liqueur.png')}
            mr="md"
            title="Licorería"
          />

          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/globe.png')}
            mr="md"
            title="Hotel"
          />

          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/computer.png')}
            mr="md"
            title="Tecnología"
          />

          <RecommendItem
            onPress={() => {}}
            imageSource={require('@yuju/assets/images/objects/personal-care.png')}
            title="Discoteca"
          />
        </Div>
      </Div>
    </Div>
  );
};
