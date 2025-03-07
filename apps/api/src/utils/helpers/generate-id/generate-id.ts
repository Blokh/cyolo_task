import * as cuid from 'cuid';

export const generateId = (): string => {
  return cuid();
};
