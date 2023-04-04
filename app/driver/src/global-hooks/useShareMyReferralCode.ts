import {useClipboard} from '@react-native-clipboard/clipboard';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetReferralsResponse} from '@yuju/types/app';
import Share from 'react-native-share';
import {Notifier} from 'react-native-notifier';
import {Vibration} from 'react-native';

const DOWNLOAD_APP_LINK = 'https://shair.dev/';

export const useShareMyReferralCode = () => {
  const [, copyToClipboard] = useClipboard();
  const {
    data: myReferrals,
    isLoading,
    isError,
  } = useRequest<GetReferralsResponse>({
    method: 'GET',
    url: '/users/me/referrals',
  });

  const handleShareMyReferralCode = () => {
    Share.open({
      title: 'Comparte Yuju con tus amigos!',
      message: `Hola, te invito a formar parte de Yuju, una mejor forma de transportarse. Descarga Yuju ahora desde aquí ${DOWNLOAD_APP_LINK}, recuerda ingresar mi código *${myReferrals?.code}* al momento de registrarte. Seguridad, confianza y rapidez con Yuju.`,
    });
  };

  const handleCopyMyReferralCodeToClipboard = () => {
    if (isLoading || isError || !myReferrals) return;

    copyToClipboard(myReferrals.code);

    Vibration.vibrate(15);

    Notifier.showNotification({
      title: 'Portapapeles',
      description: 'Tu código de invitación ha sido copiado al portapapeles.',
      hideOnPress: true,
    });
  };

  return {
    isLoading,
    myReferrals,
    handleCopyMyReferralCodeToClipboard,
    handleShareMyReferralCode,
  };
};
