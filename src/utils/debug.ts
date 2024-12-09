import { config } from '../config';

export const debug = {
  log: (...args: any[]) => {
    if (config.DEBUG_MODE) {
      console.log('[PLM Debug]:', ...args);
    }
  },
  error: (...args: any[]) => {
    if (config.DEBUG_MODE) {
      console.error('[PLM Error]:', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.DEBUG_MODE) {
      console.warn('[PLM Warning]:', ...args);
    }
  },
  table: (data: any) => {
    if (config.DEBUG_MODE) {
      console.table(data);
    }
  },
  group: (label: string, fn: () => void) => {
    if (config.DEBUG_MODE) {
      console.group(`[PLM Debug]: ${label}`);
      try {
        fn();
      } finally {
        console.groupEnd();
      }
    }
  }
};