export interface IJwtToken {
  sub: string | number;
  role: string;
}

export interface IEncrypter {
  encrypt(value: string, salt?: number): Promise<string>;
  compareHash(originalString: string, hashedString: string): Promise<boolean>;
}

export interface IBcrypt {
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

export interface IAuthenticationService {
  hashPassword(password: string, salt: number): Promise<string>;
  compareHash(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(payload: { sub: string | number; role: string }): string;
  decodeToken(token: string): IJwtToken;
}
