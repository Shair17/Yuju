import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {TripController} from './trip.controller';

export const TripModule: Constructor<unknown>[] = [TripController];
