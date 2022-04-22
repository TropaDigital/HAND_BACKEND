import bcrypt from 'bcrypt';

import { IBcrypt, IEncrypter } from './interfaces';

export class BcryptAdapter implements IEncrypter {
  constructor(private readonly bcryptLib: IBcrypt = bcrypt) {}

  public async compareHash(
    originalString: string,
    hashedString: string,
  ): Promise<boolean> {
    return this.bcryptLib.compare(originalString, hashedString);
  }

  public async encrypt(value: string, salt = 12): Promise<string> {
    return this.bcryptLib.hash(value, salt);
  }
}
