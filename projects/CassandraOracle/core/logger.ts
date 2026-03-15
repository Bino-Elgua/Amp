// LOGGER - Structured logging for Cassandra

import * as fs from 'fs';
import * as path from 'path';

interface LogEntry {
  timestamp: string;
  level: string;
  module: string;
  message: string;
  data?: unknown;
}

export class Logger {
  private module: string;
  private logPath: string;

  constructor(module: string) {
    this.module = module;
    this.logPath = process.env.ORACLE_LOG_PATH || '/data/data/com.termux/files/home/cassandra/logs';
    this.ensureLogDir();
  }

  private ensureLogDir(): void {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath, { recursive: true });
    }
  }

  private writeLog(entry: LogEntry): void {
    const logFile = path.join(this.logPath, `${this.module}.log`);
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.module}] ${message}`;
  }

  info(message: string, data?: unknown): void {
    const formatted = this.formatMessage('INFO', message);
    console.log(formatted);
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      module: this.module,
      message,
      data,
    });
  }

  error(message: string, error?: unknown): void {
    const formatted = this.formatMessage('ERROR', message);
    console.error(formatted);
    if (error) console.error(error);
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      module: this.module,
      message,
      data: error,
    });
  }

  warn(message: string, data?: unknown): void {
    const formatted = this.formatMessage('WARN', message);
    console.warn(formatted);
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      module: this.module,
      message,
      data,
    });
  }

  debug(message: string, data?: unknown): void {
    if (process.env.DEBUG) {
      const formatted = this.formatMessage('DEBUG', message);
      console.debug(formatted);
      this.writeLog({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        module: this.module,
        message,
        data,
      });
    }
  }
}
