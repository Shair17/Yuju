import React, {Fragment} from 'react';
import {useCheckLocationPermissions} from '@yuju/modules/location/hooks/useCheckLocationPermissions';

export const Permissions: React.FC<React.PropsWithChildren> = ({children}) => {
  useCheckLocationPermissions();

  return <Fragment>{children}</Fragment>;
};
