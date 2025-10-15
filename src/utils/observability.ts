export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogEvent = {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  time: string;
};

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const evt: LogEvent = { level, message, context, time: new Date().toISOString() };
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](JSON.stringify(evt));
}

export function timeFn<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
  const start = Date.now();
  try {
    const result = Promise.resolve(fn());
    return result.finally(() => {
      const ms = Date.now() - start;
      log('info', 'timing', { name, ms });
    });
  } catch (err) {
    const ms = Date.now() - start;
    log('error', 'timing_error', { name, ms, err: (err as Error).message });
    throw err;
  }
}
