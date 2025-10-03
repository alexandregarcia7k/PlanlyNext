import { isProduction, isDevelopment } from './env';

/**
 * Níveis de log disponíveis
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Interface para estruturação de logs
 */
interface LogContext {
  [key: string]: unknown;
}

/**
 * Classe de Logger seguro para produção
 * Em desenvolvimento: exibe no console
 * Em produção: pode ser integrado com Sentry, DataDog, etc.
 */
class Logger {
  /**
   * Log de informação
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log de aviso
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: isDevelopment ? error.stack : undefined, // Stack trace só em dev
        name: error.name,
      } : error,
    };

    this.log('error', message, errorContext);

    // TODO: Integrar com Sentry ou outro serviço em produção
    // if (isProduction) {
    //   Sentry.captureException(error, { extra: errorContext });
    // }
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: LogContext): void {
    if (isDevelopment) {
      this.log('debug', message, context);
    }
  }

  /**
   * Método interno para processar logs
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();

    // Em desenvolvimento, usar console
    if (isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      console[consoleMethod](`[${timestamp}] [${level.toUpperCase()}]`, message, context || '');
    }

    // Em produção, você pode enviar para um serviço de logging
    if (isProduction) {
      const logData = {
        timestamp,
        level,
        message,
        ...context,
      };
      // TODO: Enviar para serviço de logging (Sentry, DataDog, LogRocket, etc.)
      // sendToLoggingService(logData);
      void logData; // Evita warning de variável não usada
    }
  }
}

/**
 * Instância singleton do logger
 */
export const logger = new Logger();
