import React from 'react';
import {SafeAreaView, ScrollView, ScrollViewProps} from 'react-native';
import {globalStyles} from '@yuju/styles/globals';

interface Props extends React.PropsWithChildren {
  scrollViewProps?: ScrollViewProps;
}

export const ScrollScreen: React.FC<Props> = ({children, scrollViewProps}) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
