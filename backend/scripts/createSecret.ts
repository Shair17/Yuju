import {randomBytes} from 'crypto';
import {promisify} from 'util';

async function createSecret() {
  const length = process.argv[2];
  const buff = await promisify(randomBytes)(+length || 32);
  console.log(buff.toString('base64'));
}

createSecret();
