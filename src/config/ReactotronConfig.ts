/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Definindo a interface para o Reactotron
interface ReactotronConfig {
  log(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  display(value: any): void
  clear(): void
  createEnhancer(): <T>(f: T) => T
  createSagaMonitor(): null
}

// Estendendo a interface do Console
declare namespace NodeJS {
  interface Global {
    console: {
      tron: ReactotronConfig
      log: typeof console.log
      warn: typeof console.warn
      error: typeof console.error
    }
  }
}

// Mock console.tron para evitar erros
if (process.env.NODE_ENV === 'development') {
  const tronConfig: ReactotronConfig = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    display: () => {},
    clear: () => {},
    createEnhancer: () => f => f,
    createSagaMonitor: () => null,
  }

  ;(global.console as any).tron = tronConfig
}

// Exportando um valor vazio para fazer este arquivo ser tratado como um módulo
export {}
