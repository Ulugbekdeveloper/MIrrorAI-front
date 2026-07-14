import { MINIMUM_AGE_YEARS } from '../constants';

export function meetsMinimumAge(birthday: Date): boolean {
  const latestAllowedBirthday = new Date();
  latestAllowedBirthday.setFullYear(latestAllowedBirthday.getFullYear() - MINIMUM_AGE_YEARS);
  return birthday <= latestAllowedBirthday;
}

export function formatBirthday(birthday: Date): string {
  return birthday.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
