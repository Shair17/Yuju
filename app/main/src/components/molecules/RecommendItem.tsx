import React from 'react';
import {ImageSourcePropType, TouchableOpacity} from 'react-native';
import {Div, DivProps, Image, Text} from 'react-native-magnus';
import TextTicker from 'react-native-text-ticker';

interface Props extends DivProps {
  imageSource: ImageSourcePropType;
  title: string;
  onPress: () => void;
}

export const RecommendItem: React.FC<Props> = ({
  imageSource,
  title,
  onPress,
  ...rest
}) => {
  return (
    <Div
      flex={1.5}
      rounded="lg"
      px="lg"
      py="md"
      borderWidth={1}
      borderColor="gray200"
      alignItems="center"
      justifyContent="center"
      {...rest}>
      <TouchableOpacity style={{flex: 1}} onPress={onPress} activeOpacity={0.7}>
        <Div flex={1} alignItems="center" justifyContent="center">
          <Image
            alignSelf="center"
            source={imageSource}
            w={50}
            h={50}
            resizeMode="contain"
          />

          <TextTicker duration={5000} loop bounce>
            <Text fontWeight="bold" fontSize="md">
              {title}
            </Text>
          </TextTicker>
        </Div>
      </TouchableOpacity>
    </Div>
  );
};
