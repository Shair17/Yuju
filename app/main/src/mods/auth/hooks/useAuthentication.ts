import {useState, useCallback} from 'react';
import {StatusBar} from 'react-native';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import useAxios from 'axios-hooks';
import {
  LoginWithFacebookBody,
  LoginWithFacebookResponse,
} from '@yuju/types/app';

export const useAuthentication = () => {
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [{loading}, executeLogInWithFacebook] = useAxios<
    LoginWithFacebookResponse,
    LoginWithFacebookBody
  >(
    {
      url: '/auth/user/facebook',
      method: 'POST',
    },
    {manual: true},
  );
  const setTokens = useAuthStore(s => s.setTokens);
  const setIsNew = useAuthStore(s => s.setIsNew);

  const loginWithFacebook = useCallback(async () => {
    try {
      const {isCancelled} = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      setOverlayVisible(true);

      if (isCancelled) {
        Notifier.showNotification({
          title: 'Error',
          description:
            'El inicio de sesión con Facebook fue cancelado por el usuario.',
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'warn',
          },
          containerStyle: {
            paddingTop: StatusBar.currentHeight,
          },
        });

        setOverlayVisible(false);
      } else {
        const user = await AccessToken.getCurrentAccessToken();

        if (user) {
          const {accessToken, userID} = user;

          executeLogInWithFacebook({
            data: {
              accessToken,
              userID,
            },
          })
            .then(response => {
              Notifier.showNotification({
                title: 'Yuju',
                description:
                  'Inicio de sesión con éxito, cargando tus datos...',
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: 'success',
                },
                containerStyle: {
                  paddingTop: StatusBar.currentHeight,
                },
                duration: 1000,
                onHidden: () => {
                  setIsNew(response.data.isNew);
                  setTokens({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                  });
                  setOverlayVisible(false);
                },
              });
            })
            .catch(error => {
              Notifier.showNotification({
                title: 'Error',
                description:
                  'Error al conectarse a Yuju, intenta nuevamente en unos minutos.',
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: 'error',
                  backgroundColor: 'red',
                },
                containerStyle: {
                  paddingTop: StatusBar.currentHeight,
                },
              });
              setOverlayVisible(false);
            });
        } else {
          Notifier.showNotification({
            title: 'Error',
            description:
              'Los datos necesarios para iniciar sesión no fueron recibidos correctamente.',
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: 'warn',
            },
            containerStyle: {
              paddingTop: StatusBar.currentHeight,
            },
          });

          setOverlayVisible(false);
        }
      }
    } catch (error) {
      Notifier.showNotification({
        title: 'Error',
        description: 'Ocurrió un error al conectarse a la SDK de Facebook.',
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
          backgroundColor: 'red',
        },
        containerStyle: {
          paddingTop: StatusBar.currentHeight,
        },
      });
      setOverlayVisible(false);
    }
  }, []);

  return {
    overlayVisible,
    loading,
    loginWithFacebook,
  };
};
