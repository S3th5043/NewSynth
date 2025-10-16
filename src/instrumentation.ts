import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

export function register() {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);
}
