import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {DriverController} from './driver.controller';

export const DriverModule: Constructor<unknown>[] = [DriverController];
