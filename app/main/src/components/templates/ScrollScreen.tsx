import React from 'react';
import {SafeAreaView, ScrollView, ScrollViewProps} from 'react-native';

interface Props extends React.PropsWithChildren {
  scrollViewProps?: ScrollViewProps;
}

export const ScrollScreen: React.FC<Props> = ({children, scrollViewProps}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
