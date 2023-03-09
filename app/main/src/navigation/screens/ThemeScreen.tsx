import React from 'react';
import {StatusBar} from 'react-native';
import {Div, Radio, Text, useTheme} from 'react-native-magnus';
import {darkTheme} from '@yuju/theme/darkTheme';
import {lightTheme} from '@yuju/theme/lightTheme';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {DevelopedByShair} from '@yuju/components/atoms/DevelopedByShair';
import {useThemeStorage} from '@yuju/global-hooks/useThemeStorage';

const ThemeOptions = [
  {
    displayName: 'Claro',
    themeName: 'light',
  },
  {
    displayName: 'Oscuro',
    themeName: 'dark',
  },
];

type Theme = 'light' | 'dark';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ThemeScreen'> {}

export const ThemeScreen: React.FC<Props> = () => {
  const [themeStorage, setThemeStorage] = useThemeStorage();
  const defaultValue = themeStorage ?? 'light';
  const {setTheme} = useTheme();

  const onChange = (themeName: Theme) => {
    if (themeName === 'dark') {
      setTheme(darkTheme);
      setThemeStorage('dark');
      StatusBar.setBackgroundColor('#000');
      StatusBar.setBarStyle('light-content');
    } else {
      setTheme(lightTheme);
      setThemeStorage('light');
      StatusBar.setBackgroundColor('#fff');
      StatusBar.setBarStyle('dark-content');
    }
  };

  return (
    <Div flex={1} bg="body">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Div px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Radio.Group defaultValue={defaultValue} onChange={onChange}>
          {ThemeOptions.map(({displayName, themeName}, key) => (
            <Radio
              key={key.toString()}
              value={themeName}
              prefix={
                <Text flex={1} fontWeight="500" fontSize="xl">
                  {displayName}
                </Text>
              }
              activeColor="primary"
              mb="lg">
              {null}
            </Radio>
          ))}
        </Radio.Group>

        <DevelopedByShair />
      </Div>
    </Div>
  );
};
