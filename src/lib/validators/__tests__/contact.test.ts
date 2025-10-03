import { describe, it, expect } from 'vitest';
import { contactSchema } from '../contact';

describe('Contact Form Validator', () => {
  describe('Validações de sucesso', () => {
    it('deve aceitar dados válidos completos', () => {
      const dados = {
        name: 'Alexandre Garcia',
        email: 'alexandre@example.com',
        subject: 'Teste de contato',
        message: 'Esta é uma mensagem de teste válida.',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data).toEqual(dados);
      }
    });

    it('deve aceitar nome com acentos', () => {
      const dados = {
        name: 'José María García',
        email: 'jose@gmail.com',
        subject: 'Teste de contato',
        message: 'Esta é uma mensagem de teste válida com mais de 30 caracteres.',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(true);
    });

    it('deve aceitar mensagem longa', () => {
      const dados = {
        name: 'User',
        email: 'user@gmail.com',
        subject: 'Teste de contato',
        message: 'a'.repeat(800), // 800 caracteres (dentro do limite de 1000)
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(true);
    });
  });

  describe('Validações de falha - Nome', () => {
    it('deve rejeitar nome vazio', () => {
      const dados = {
        name: '',
        email: 'user@example.com',
        subject: 'Teste',
        message: 'Mensagem',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
      if (!resultado.success) {
        expect(resultado.error.issues[0].path).toContain('name');
      }
    });

    it('deve rejeitar nome muito curto', () => {
      const dados = {
        name: 'A',
        email: 'user@example.com',
        subject: 'Teste',
        message: 'Mensagem',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
    });
  });

  describe('Validações de falha - Email', () => {
    it('deve rejeitar email inválido', () => {
      const dados = {
        name: 'User',
        email: 'email-invalido',
        subject: 'Teste',
        message: 'Mensagem',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
    });

    it('deve rejeitar email vazio', () => {
      const dados = {
        name: 'User',
        email: '',
        subject: 'Teste',
        message: 'Mensagem',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
    });
  });

  describe('Validações de falha - Subject', () => {
    it('deve rejeitar assunto vazio', () => {
      const dados = {
        name: 'User',
        email: 'user@example.com',
        subject: '',
        message: 'Mensagem',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
    });
  });

  describe('Validações de falha - Message', () => {
    it('deve rejeitar mensagem vazia', () => {
      const dados = {
        name: 'User',
        email: 'user@example.com',
        subject: 'Teste',
        message: '',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
    });

    it('deve rejeitar mensagem muito curta', () => {
      const dados = {
        name: 'User',
        email: 'user@example.com',
        subject: 'Teste',
        message: 'Oi',
      };

      const resultado = contactSchema.safeParse(dados);

      expect(resultado.success).toBe(false);
    });
  });
});
