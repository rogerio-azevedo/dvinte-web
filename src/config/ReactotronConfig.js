/* eslint-disable no-console */

// Mock console.tron para evitar erros
if (process.env.NODE_ENV === 'development') {
  console.tron = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    display: () => {},
    clear: () => {},
    createEnhancer: () => f => f,
    createSagaMonitor: () => null,
  }
}
