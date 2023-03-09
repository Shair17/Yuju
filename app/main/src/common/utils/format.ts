import {format, TDate} from 'timeago.js';

export const formatDate = (date: TDate) => format(date, 'es_PE');

export const formatCurrency = (mount: number) => {
  if (typeof mount === 'string') {
    mount = +mount;
  }

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(mount);
};
