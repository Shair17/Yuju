import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.locale('es');
dayjs.extend(relativeTime);

AppRegistry.registerComponent(appName, () => App);
