import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {VehicleController} from './vehicle.controller';

export const VehicleModule: Constructor<unknown>[] = [VehicleController];
