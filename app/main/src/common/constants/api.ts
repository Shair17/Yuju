import {isDev} from './environment';

// MODIFICAR ESTE CUANDO CAMBIE LA IP
export const BASE_API = 'http://192.168.1.47:3000';

export const API_BASE = `${BASE_API}/v1`;

// export const API_BASE = 'http://192.168.100.109:3000/v1';

// export const API_BASE = isDev
// ? 'http://192.168.1.47:3000/v1'
// : 'https://api.fastly.delivery/v1';
