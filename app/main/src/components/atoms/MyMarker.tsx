import React, {memo} from 'react';
import {Marker, MapMarkerProps} from 'react-native-maps';

interface Props extends MapMarkerProps {}

const MyPin: React.FC<Props> = props => (
  <Marker tracksViewChanges={false} {...props} />
);

export const MyMarker = memo(MyPin);
