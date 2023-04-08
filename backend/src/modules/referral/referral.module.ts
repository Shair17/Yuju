import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {ReferralController} from './referral.controller';

export const ReferralModule: Constructor<unknown>[] = [ReferralController];
