import { Redis } from '@upstash/redis';
import { env } from './env';
import { logger } from './logger';

/**
 * Cliente Redis singleton com tratamento de erros
 */
class RedisClient {
  private client: Redis;
  private isHealthy: boolean = true;

  constructor() {
    this.client = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  /**
   * Verifica se a chave existe e se passou o tempo limite
   * @returns true se a requisição deve ser bloqueada (rate limit atingido)
   */
  async checkRateLimit(
    key: string
  ): Promise<{ blocked: boolean; error?: string }> {
    try {
      const lastAttempt = await this.client.get<number>(key);

      if (lastAttempt) {
        return { blocked: true };
      }

      return { blocked: false };
    } catch (error) {
      this.isHealthy = false;
      logger.error('Erro ao verificar rate limit no Redis', error, { key });

      // Em caso de erro no Redis, permitir mas logar
      // Alternativa: retornar { blocked: true, error: '...' } para fail-closed
      return {
        blocked: false,
        error: 'Sistema de rate limiting temporariamente indisponível'
      };
    }
  }

  /**
   * Marca uma requisição no rate limit
   */
  async setRateLimit(key: string, windowSeconds: number = 60): Promise<void> {
    try {
      await this.client.set(key, Date.now(), { ex: windowSeconds });
      this.isHealthy = true;
    } catch (error) {
      this.isHealthy = false;
      logger.error('Erro ao definir rate limit no Redis', error, { key });
    }
  }

  /**
   * Verifica se o Redis está saudável
   */
  getHealthStatus(): boolean {
    return this.isHealthy;
  }
}

/**
 * Instância singleton do Redis client
 */
export const redis = new RedisClient();
