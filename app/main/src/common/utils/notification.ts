import {Notifier, NotifierComponents} from 'react-native-notifier';

interface ShowNotificationProps {
  title: string;
  description: string;
  alertType: 'error' | 'info' | 'success' | 'warn';
}

export const showNotification = ({
  title,
  description,
  alertType,
}: ShowNotificationProps) => {
  Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType,
      ...(alertType === 'error' && {backgroundColor: 'red'}),
    },
  });
};
