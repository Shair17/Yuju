import React, {Fragment, useEffect} from 'react';
import {useAuth} from '@yuju/modules/auth/hooks/useAuth';
import {authBottomSheetRef} from '@yuju/modules/auth/refs';
import {isValidToken, isTokenExpired} from '@yuju/modules/auth/helpers/token';
import {showNotification} from '../helpers/notifier';

export const Auth: React.FC<React.PropsWithChildren> = ({children}) => {
  const {
    tokens: {accessToken, refreshToken},
    removeTokens,
    setStatus,
  } = useAuth();

  useEffect(() => {
    if (typeof accessToken === 'string' && typeof refreshToken === 'string') {
      if (isValidToken(accessToken) && isValidToken(refreshToken)) {
        if (isTokenExpired(refreshToken)) {
          removeTokens();
          // console.log('refreshToken expirado, remover accessToken y refreshToken');
          setStatus('unauthenticated');
          // showNotification({title: '¡NO Autenticado!'});
        } else {
          authBottomSheetRef.current?.forceClose();
          // console.log('autenticado!!');
          setStatus('authenticated');
          // showNotification({title: '¡Autenticado!'});
        }
      } else {
        authBottomSheetRef.current?.expand();
        removeTokens();
        // console.log('accessToken y refreshToken inválidos!!');
        setStatus('unauthenticated');
        // showNotification({title: '¡NO Autenticado!'});
      }
    } else {
      setStatus('unauthenticated');
      // showNotification({title: '¡NO Autenticado!'});
    }
  }, [accessToken, refreshToken]);

  return <Fragment>{children}</Fragment>;
};
