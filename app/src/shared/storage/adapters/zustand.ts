import {type StateStorage} from 'zustand/middleware';
import {storage} from '../instance';

export const zustandStorageAdapter: StateStorage = {
  setItem: (key, value) => {
    return storage.set(key, value);
  },
  getItem: key => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: key => {
    return storage.delete(key);
  },
};
