import {Service} from 'fastify-decorators';
import * as argon2 from 'argon2';

@Service('HashingServiceToken')
export class HashingService {
  private readonly argon2: typeof argon2;

  constructor() {
    this.argon2 = argon2;
  }

  hash(password: string): Promise<string> {
    return this.argon2.hash(password);
  }

  verify(
    hash: string,
    plain: string | Buffer,
    options?: argon2.Options | undefined,
  ): Promise<boolean> {
    return this.argon2.verify(hash, plain, options);
  }
}
