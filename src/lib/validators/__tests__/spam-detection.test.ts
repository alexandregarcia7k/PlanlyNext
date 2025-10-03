import { describe, it, expect } from 'vitest';
import { detectSuspiciousPatterns } from '../email-security';

describe('Suspicious Patterns Detector', () => {
  describe('Emails com muitos números', () => {
    it('deve detectar email com 5+ números consecutivos', () => {
      const resultado = detectSuspiciousPatterns(
        'user123456@gmail.com',
        'João Silva',
        'Mensagem normal'
      );

      expect(resultado.suspicious).toBe(true);
      expect(resultado.reason).toContain('números');
    });

    it('deve aceitar email com poucos números', () => {
      const resultado = detectSuspiciousPatterns(
        'user123@gmail.com',
        'João Silva',
        'Mensagem normal'
      );

      expect(resultado.suspicious).toBe(false);
    });
  });

  describe('Nomes suspeitos', () => {
    it('deve detectar nome muito curto', () => {
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'J',
        'Mensagem normal'
      );

      expect(resultado.suspicious).toBe(true);
      expect(resultado.reason).toContain('Nome');
    });

    it('deve detectar nome todo em minúsculas sem espaços', () => {
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'joaosilva',
        'Mensagem normal'
      );

      expect(resultado.suspicious).toBe(true);
    });

    it('deve aceitar nome válido', () => {
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'João Silva',
        'Mensagem normal'
      );

      expect(resultado.suspicious).toBe(false);
    });
  });

  describe('Mensagens com muitos links', () => {
    it('deve detectar mensagem com mais de 2 links', () => {
      const mensagem = 'Veja http://site1.com e http://site2.com e http://site3.com';
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'João Silva',
        mensagem
      );

      expect(resultado.suspicious).toBe(true);
      expect(resultado.reason).toContain('links');
    });

    it('deve aceitar mensagem com 1-2 links', () => {
      const mensagem = 'Veja http://site.com';
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'João Silva',
        mensagem
      );

      expect(resultado.suspicious).toBe(false);
    });
  });

  describe('Mensagens em maiúscula (spam)', () => {
    it('deve detectar mensagem toda em maiúscula', () => {
      const mensagem = 'COMPRE AGORA COM DESCONTO IMPERDÍVEL!!!';
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'João Silva',
        mensagem
      );

      expect(resultado.suspicious).toBe(true);
      expect(resultado.reason).toContain('maiúscula');
    });

    it('deve aceitar mensagem normal', () => {
      const mensagem = 'Olá, gostaria de mais informações sobre o produto.';
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'João Silva',
        mensagem
      );

      expect(resultado.suspicious).toBe(false);
    });

    it('deve ignorar mensagens curtas em maiúscula', () => {
      const mensagem = 'OI';
      const resultado = detectSuspiciousPatterns(
        'user@gmail.com',
        'João Silva',
        mensagem
      );

      expect(resultado.suspicious).toBe(false);
    });
  });

  describe('Validação de inputs', () => {
    it('deve retornar não suspeito para email vazio', () => {
      const resultado = detectSuspiciousPatterns('', 'Nome', 'Mensagem');

      expect(resultado.suspicious).toBe(false);
    });

    it('deve retornar não suspeito para nome vazio', () => {
      const resultado = detectSuspiciousPatterns('user@gmail.com', '', 'Mensagem');

      expect(resultado.suspicious).toBe(false);
    });

    it('deve retornar não suspeito para mensagem vazia', () => {
      const resultado = detectSuspiciousPatterns('user@gmail.com', 'Nome', '');

      expect(resultado.suspicious).toBe(false);
    });
  });
});
