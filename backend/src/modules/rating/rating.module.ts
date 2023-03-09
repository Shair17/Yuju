import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {RatingController} from './rating.controller';

export const RatingModule: Constructor<unknown>[] = [RatingController];
