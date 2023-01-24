import { randomInt } from 'crypto';

export const generateInsertCode = (): string => {
  const year = new Date().getFullYear();
  return `${year}${randomInt(500000)}`.padEnd(10, '0');
};
