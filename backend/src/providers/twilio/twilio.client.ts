import Twilio from 'twilio';
import {TwilioClientOptions, TwilioClient} from './twilio.interface';

export const createTwilioClient = ({
  accountSid,
  authToken,
  options,
}: TwilioClientOptions): TwilioClient => Twilio(accountSid, authToken, options);
