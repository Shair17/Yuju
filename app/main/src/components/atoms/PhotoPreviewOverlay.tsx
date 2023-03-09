import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {Image, Overlay} from 'react-native-magnus';

interface Props {
  closePhotoOverlay: () => void;
  photoPreviewOverlayVisible: boolean;
  avatar: any;
}

export const PhotoPreviewOverlay: React.FC<Props> = ({
  avatar,
  closePhotoOverlay,
  photoPreviewOverlayVisible,
}) => {
  return (
    <Overlay
      onRequestClose={closePhotoOverlay}
      visible={photoPreviewOverlayVisible}
      onBackdropPress={closePhotoOverlay}
      onDismiss={closePhotoOverlay}
      transparent={false}
      statusBarTranslucent
      overlayColor="#000"
      overlayOpacity={1}
      p={0}
      bg="#000"
      m={0}
      w="100%"
      h="100%">
      <TouchableWithoutFeedback onPress={closePhotoOverlay} style={{flex: 1}}>
        <Image flex={1} resizeMode="contain" source={avatar} />
      </TouchableWithoutFeedback>
    </Overlay>
  );
};
