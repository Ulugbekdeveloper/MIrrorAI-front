const enabled = __DEV__;

export const logger = {
  debug: (...args: unknown[]) => {
    if (enabled) console.log('[mirror]', ...args);
  },
  info: (...args: unknown[]) => {
    if (enabled) console.info('[mirror]', ...args);
  },
  warn: (...args: unknown[]) => console.warn('[mirror]', ...args),
  error: (...args: unknown[]) => console.error('[mirror]', ...args),
};
