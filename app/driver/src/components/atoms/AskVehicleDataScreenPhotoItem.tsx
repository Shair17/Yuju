import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Div, DivProps, Text} from 'react-native-magnus';
import {URL_REGEX} from '@yuju/common/regex';

interface Props {
  bg?: string;
  h?: number;
  onPress: () => void;
  containerProps?: DivProps;
  text: string;
}

export const AskVehicleDataScreenPhotoItem: React.FC<Props> = ({
  bg,
  h = 100,
  containerProps,
  onPress,
  text,
}) => {
  const isUrl = URL_REGEX.test(bg!);

  return (
    <Div flex={1} h={h} {...containerProps}>
      <TouchableOpacity style={{flex: 1}} onPress={onPress} activeOpacity={0.8}>
        <Div
          bgImg={{
            uri: isUrl ? bg : `data:image/png;base64,${bg}`,
          }}
          flex={1}
          alignItems="center"
          justifyContent="center"
          rounded="lg"
          borderWidth={2}
          borderStyle="dotted"
          borderColor="primary500"
          bg="primary50">
          {!bg ? (
            <Text color="primary500" fontSize="2xl" fontWeight="bold">
              {text}
            </Text>
          ) : null}
        </Div>
      </TouchableOpacity>
    </Div>
  );
};
