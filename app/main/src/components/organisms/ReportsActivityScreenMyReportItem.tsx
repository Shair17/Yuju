import React from 'react';
import {Div, Icon, Text, DivProps} from 'react-native-magnus';

interface Props extends DivProps {
  title: string;
  description: string;
}

export const ReportsActivityScreenMyReportItem: React.FC<Props> = ({
  title,
  description,
  ...props
}) => {
  return (
    <Div
      mt="lg"
      row
      bg="gray50"
      rounded="lg"
      p="lg"
      alignItems="center"
      {...props}>
      <Icon
        mr="lg"
        fontFamily="Ionicons"
        name="archive-outline"
        color="#000"
        fontSize="6xl"
      />
      <Div flex={1}>
        <Text color="#000" fontWeight="bold" fontSize="3xl">
          {title}
        </Text>
        <Text color="gray500" numberOfLines={4}>
          {description}
        </Text>
      </Div>
    </Div>
  );
};
