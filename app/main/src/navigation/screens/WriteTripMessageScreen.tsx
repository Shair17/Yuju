import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Div, Text, Input, Button, Icon} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import {useTripStore} from '@yuju/global-stores/useTripStore';
import {MAX_TRIP_MESSAGE_LENGTH} from '@yuju/common/constants/app';
import {getRandomPlaceholder} from '@yuju/common/utils/random';

interface Props
  extends NativeStackScreenProps<
    RequestStackParams,
    'WriteTripMessageScreen'
  > {}

export const WriteTripMessageScreen: React.FC<Props> = ({navigation}) => {
  const [message, setMessage] = useTripStore(s => [s.message, s.setMessage]);
  const hasMessage = !!message;
  const messageReachedLimit = hasMessage
    ? message.length >= MAX_TRIP_MESSAGE_LENGTH
    : false;
  const randomPlaceholder = getRandomPlaceholder();

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
          }}
          style={{flex: 1}}>
          <Div flex={1} bg="body" p="2xl" pt="md">
            <Div>
              <Text fontSize="5xl" fontWeight="bold" color="text">
                Aquí puedes dejar un mensaje a tu chófer.
              </Text>
              <Text fontSize="xs" color="gray500">
                * Este mensaje es opcional
              </Text>
            </Div>

            <Div mt="lg">
              <Div position="relative">
                {hasMessage ? (
                  <Button
                    position="absolute"
                    bg="red50"
                    zIndex={1}
                    top={5}
                    right={5}
                    h={20}
                    w={20}
                    p={0}
                    m={0}
                    underlayColor="red100"
                    rounded="circle">
                    <Icon
                      name="close"
                      fontSize="md"
                      fontFamily="Ionicons"
                      color="red500"
                    />
                  </Button>
                ) : null}
                <Input
                  autoFocus
                  placeholder={randomPlaceholder}
                  keyboardType="default"
                  autoCapitalize="none"
                  rounded="lg"
                  fontWeight="500"
                  focusBorderColor={messageReachedLimit ? 'red' : 'primary700'}
                  fontSize="xl"
                  maxLength={MAX_TRIP_MESSAGE_LENGTH}
                  numberOfLines={4}
                  multiline
                  textAlignVertical="top"
                  onChangeText={setMessage}
                  value={message}
                  borderColor={messageReachedLimit ? 'red' : 'gray400'}
                />
              </Div>
              <Div row justifyContent="space-between">
                <Text
                  mt="xs"
                  fontSize="xs"
                  color={messageReachedLimit ? 'red' : 'gray500'}
                  fontWeight={messageReachedLimit ? '600' : '400'}>
                  {message?.length ?? 0}/{MAX_TRIP_MESSAGE_LENGTH}
                </Text>

                {messageReachedLimit ? (
                  <Text mt="xs" fontSize="xs" color="red" fontWeight="600">
                    Haz alcandado el límite
                  </Text>
                ) : null}
              </Div>
            </Div>

            <Div position="absolute" bottom={10} alignSelf="center">
              <Text fontSize={10} color="gray500">
                * Tu mensaje se guarda automáticamente
              </Text>
            </Div>
          </Div>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
