import React from 'react';
import {Div, Image, Skeleton, Text, useTheme} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {Report} from '@yuju/types/app';
import {FlashList} from '@shopify/flash-list';
import {ReportsActivityScreenMyReportItem} from '@yuju/components/organisms/ReportsActivityScreenMyReportItem';
import {usePagination} from '@yuju/global-hooks/usePagination';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ReportsActivityScreen'> {}

export const ReportsActivityScreen: React.FC<Props> = ({navigation}) => {
  const {
    theme: {colors},
  } = useTheme();
  const {
    isLoading,
    myData: myReports,
    handleAddMoreItems,
  } = usePagination<Report>({
    url: `/bug-reports/users`,
  });

  if (isLoading) {
    return (
      <Div bg="body" flex={1} px="2xl">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, key) => (
          <Skeleton key={key} h={70} rounded="lg" mt="lg" p="lg" bg="gray100" />
        ))}
      </Div>
    );
  }

  if (myReports.length === 0) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Image
          source={require('@yuju/assets/images/frowning-face.png')}
          w={150}
          h={150}
        />
        <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
          Aún no tienes reportes
        </Text>
      </Div>
    );
  }

  return (
    <FlashList
      estimatedItemSize={20}
      data={myReports}
      renderItem={({item: {title, description}}) => {
        return (
          <ReportsActivityScreenMyReportItem
            title={title}
            description={description}
            mx="2xl"
          />
        );
      }}
      keyExtractor={report => report.id}
      onEndReached={handleAddMoreItems}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        backgroundColor: colors?.body,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};
