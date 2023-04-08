import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Div, Text, DivProps} from 'react-native-magnus';
import {getRandomPlaceholder} from '@yuju/common/utils/random';

interface Props extends DivProps {
  onAskMessagePress: () => void;
  askMessageInputLabel: string;
  askMessageValue?: string;
}

export const RequestScreenAskMessageItem: React.FC<Props> = ({
  askMessageInputLabel,
  askMessageValue,
  onAskMessagePress,
  ...divProps
}) => {
  const hasMessage = !!askMessageValue;
  const randomPlaceholder = getRandomPlaceholder();

  return (
    <Div row {...divProps}>
      <Div flex={1}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAskMessagePress}
          style={{borderRadius: 8}}>
          <Div overflow="hidden" bg="gray100" rounded="lg" px="md" py="sm">
            <Text
              fontSize={10}
              fontWeight="500"
              color="gray400"
              numberOfLines={1}>
              {askMessageInputLabel} (Opcional)
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={hasMessage ? '#000' : 'gray500'}
              numberOfLines={1}>
              {hasMessage ? askMessageValue : randomPlaceholder}
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  );
};
