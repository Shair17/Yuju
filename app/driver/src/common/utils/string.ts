import {DocumentsType} from '@yuju/global-hooks/useUploadDocuments';

export const isString = (val: unknown) => typeof val === 'string';

export const getDropdownTitle = (field: keyof DocumentsType): string => {
  const messages = {
    dniPhotos: 'Subir tu DNI',
    license: 'Subir tu Licencia',
    propertyCard: 'Subir tu Tarjeta de Propiedad',
    circulationCard: 'Subir tu Tarjeta de Circulación',
    technicalReview: 'Subir tu Revisión Técnica',
    vehiclePhotos: 'Subir Fotos de tu Mototaxi',
    soat: 'Subir tu SOAT',
    default: 'Subir tu documento',
  };

  return messages[field] ?? messages['default'];
};
