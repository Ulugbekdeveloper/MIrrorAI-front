import { USERNAME_MIN_LENGTH } from '../constants';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export function isValidUsername(username: string): boolean {
  return username.length >= USERNAME_MIN_LENGTH && USERNAME_PATTERN.test(username);
}
