import {Static, Type} from '@sinclair/typebox';

// add vehicle photos
export const UpdateMyVehicleBody = Type.Object({
  plate: Type.String({minLength: 6, maxLength: 6}),
  vehiclePhotos: Type.Array(Type.String({format: 'uri'})),
  // vehiclePhotos : ...
});

export type UpdateMyVehicleBodyType = Static<typeof UpdateMyVehicleBody>;
