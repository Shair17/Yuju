import {Twilio} from 'twilio';

export type TwilioClient = Twilio;

export interface TwilioClientOptions {
  accountSid: string | undefined;
  authToken: string | undefined;
  options?: Twilio.TwilioClientOptions | undefined;
}
