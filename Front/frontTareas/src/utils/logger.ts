// Sistema de logging inteligente
const isDevelopment = import.meta.env.DEV;

export const logger = {
  // Solo en desarrollo
  dev: {
    log: (...args: any[]) => {
      if (isDevelopment) {
        console.log(...args);
      }
    },
    error: (...args: any[]) => {
      if (isDevelopment) {
        console.error(...args);
      }
    },
    warn: (...args: any[]) => {
      if (isDevelopment) {
        console.warn(...args);
      }
    },
    info: (...args: any[]) => {
      if (isDevelopment) {
        console.info(...args);
      }
    },
  },

  // Siempre (para errores críticos)
  always: {
    error: (...args: any[]) => {
      console.error(...args);
    },
    warn: (...args: any[]) => {
      console.warn(...args);
    },
  },

  // Solo en desarrollo (para debug)
  debug: {
    log: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.log(message, ...args);
      }
    },
    error: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.error(message, ...args);
      }
    },
  },
};
