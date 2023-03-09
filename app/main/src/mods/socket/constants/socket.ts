import {BASE_API} from '@yuju/common/constants/api';
import {isDev} from '@yuju/common/constants/environment';

export const SOCKET_URL = BASE_API;

// export const SOCKET_URL = !isDev
// ? 'http://192.168.1.46:3000'
// : 'https://api.fastly.delivery';

// Events
