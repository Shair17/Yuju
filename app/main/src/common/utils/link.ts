import {Linking, Alert} from 'react-native';
import {SHAIR_INSTAGRAM} from '../constants/app';

export const openLink = async (url: string, verify: boolean = false) => {
  if (verify) {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
    } else {
      Alert.alert(`No se puede abrir esta URL: ${url}`);
    }
  } else {
    await Linking.openURL(url);
  }
};

export const goToShairIG = () => openLink(SHAIR_INSTAGRAM);
