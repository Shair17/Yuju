import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import {configure} from 'axios-hooks';
import {http as axios} from './src/services/http';
import {register} from 'timeago.js';
import {getDateLang} from './src/common/utils/date';

register('es_PE', getDateLang);
configure({axios});

AppRegistry.registerComponent(appName, () => App);
