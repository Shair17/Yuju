import React from 'react';
import {BottomSheet} from './BottomSheet';
import {GestureHandler} from './GestureHandler';
import {Navigation} from './Navigation';
import {Notifier} from './Notifier';
import {Query} from './Query';
import {YujuUI} from './YujuUI';
import {Auth} from './Auth';
import {Permissions} from './Permissions';

export const Providers: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <GestureHandler>
      <Query>
        <Notifier>
          <YujuUI>
            <Permissions>
              <BottomSheet>
                <Auth>
                  <Navigation>{children}</Navigation>
                </Auth>
              </BottomSheet>
            </Permissions>
          </YujuUI>
        </Notifier>
      </Query>
    </GestureHandler>
  );
};
