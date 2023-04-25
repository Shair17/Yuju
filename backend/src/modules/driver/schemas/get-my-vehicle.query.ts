import {Type, Static} from '@sinclair/typebox';

export const GetMyVehicleQuery = Type.Object(
  {
    skipIsNewValidation: Type.Boolean({default: false}),
  },
  {
    additionalProperties: false,
  },
);
export type GetMyVehicleQueryType = Static<typeof GetMyVehicleQuery>;
