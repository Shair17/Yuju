import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {AuthController} from './auth.controller';

export const AuthModule: Constructor<unknown>[] = [AuthController];
