import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {UserController} from './user.controller';

export const UserModule: Constructor<unknown>[] = [UserController];
