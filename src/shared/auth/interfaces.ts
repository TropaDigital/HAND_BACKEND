export interface IRole {
  name: string;
}

export interface IJwtToken {
  sub: string;
  role: IRole;
}

export interface IEncrypter {
  encrypt(value: string, salt?: number): Promise<string>;
  compareHash(originalString: string, hashedString: string): Promise<boolean>;
}

export interface IBcrypt {
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

export interface IAuthService {
  hashPassword(password: string, salt: number): Promise<string>;
  compareHash(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(payload: { sub: string; role: IRole }): string;
  decodeToken(token: string): IJwtToken;
}
