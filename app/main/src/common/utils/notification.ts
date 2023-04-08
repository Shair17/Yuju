import {Notifier, NotifierComponents} from 'react-native-notifier';

interface ShowNotificationProps {
  title: string;
  description: string;
  hideOnPress?: boolean;
  onShown?: () => void;
  onHidden?: () => void;
  containerStyle?: any;
}

export const showNotification = ({
  title,
  description,
  hideOnPress,
  onShown,
  onHidden,
  containerStyle,
}: ShowNotificationProps) => {
  Notifier.showNotification({
    title,
    onShown,
    onHidden,
    description,
    hideOnPress,
    containerStyle,
  });
};

interface ShowAlertProps {
  title?: string;
  description?: string;
  alertType: 'error' | 'info' | 'success' | 'warn';
  duration?: number;
  onShown?: () => void;
  onHidden?: () => void;
  containerStyle?: any;
}

export const showAlert = ({
  title,
  description,
  alertType,
  duration,
  onShown,
  onHidden,
  containerStyle,
}: ShowAlertProps) => {
  Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Alert,
    duration,
    onShown,
    onHidden,
    componentProps: {
      alertType,
      ...(alertType === 'error' && {backgroundColor: 'red'}),
    },
    containerStyle,
  });
};
