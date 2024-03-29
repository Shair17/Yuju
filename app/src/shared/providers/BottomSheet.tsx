import React from 'react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

export const BottomSheet: React.FC<React.PropsWithChildren> = ({children}) => (
  <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
);
