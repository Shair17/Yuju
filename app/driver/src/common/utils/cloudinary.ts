import axios from 'axios';
import {makeUseAxios} from 'axios-hooks';

export const useCloudinary = makeUseAxios({
  axios,
});

export const buildBase64 = (base64: string) =>
  `data:image/jpg;base64,${base64}`;
