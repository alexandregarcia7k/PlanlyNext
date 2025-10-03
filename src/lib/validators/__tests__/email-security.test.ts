import { describe, it, expect } from 'vitest';
import { validateEmailSecurity } from '../email-security';

describe('Email Security Validator', () => {
  describe('Emails válidos', () => {
    it('deve aceitar email padrão válido', () => {
      const resultado = validateEmailSecurity('user@gmail.com');
      expect(resultado.valid).toBe(true);
      expect(resultado.error).toBeUndefined();
    });

    it('deve aceitar email com subdomínio', () => {
      const resultado = validateEmailSecurity('user@mail.yahoo.com');
      expect(resultado.valid).toBe(true);
    });

    it('deve aceitar email com números', () => {
      const resultado = validateEmailSecurity('user123@gmail.com');
      expect(resultado.valid).toBe(true);
    });

    it('deve aceitar email com hífen', () => {
      const resultado = validateEmailSecurity('user-name@outlook.com');
      expect(resultado.valid).toBe(true);
    });

    it('deve aceitar email com underscore', () => {
      const resultado = validateEmailSecurity('user_name@hotmail.com');
      expect(resultado.valid).toBe(true);
    });

    it('deve aceitar subdomínio de provedor confiável', () => {
      const resultado = validateEmailSecurity('user@corporate.gmail.com');
      expect(resultado.valid).toBe(true);
    });
  });

  describe('Emails inválidos', () => {
    it('deve rejeitar email sem @', () => {
      const resultado = validateEmailSecurity('emailinvalido');
      expect(resultado.valid).toBe(false);
      expect(resultado.error).toBeTruthy();
    });

    it('deve rejeitar email vazio', () => {
      const resultado = validateEmailSecurity('');
      expect(resultado.valid).toBe(false);
    });

    it('deve rejeitar email com espaços', () => {
      const resultado = validateEmailSecurity('user @example.com');
      expect(resultado.valid).toBe(false);
    });

    it('deve rejeitar email sem domínio', () => {
      const resultado = validateEmailSecurity('user@');
      expect(resultado.valid).toBe(false);
    });

    it('deve rejeitar email sem local part', () => {
      const resultado = validateEmailSecurity('@example.com');
      expect(resultado.valid).toBe(false);
    });
  });

  describe('Emails descartáveis/bloqueados', () => {
    it('deve rejeitar tempmail.org', () => {
      const resultado = validateEmailSecurity('user@tempmail.org');
      expect(resultado.valid).toBe(false);
      expect(resultado.error).toContain('temporário');
    });

    it('deve rejeitar guerrillamail.com', () => {
      const resultado = validateEmailSecurity('user@guerrillamail.com');
      expect(resultado.valid).toBe(false);
      expect(resultado.error).toContain('temporário');
    });

    it('deve rejeitar emails bloqueados específicos', () => {
      const resultado = validateEmailSecurity('test@test.com');
      expect(resultado.valid).toBe(false);
      expect(resultado.error).toBeTruthy();
    });
  });

  describe('Domínios não confiáveis', () => {
    it('deve rejeitar domínio desconhecido', () => {
      const resultado = validateEmailSecurity('user@dominioestranho.xyz');
      expect(resultado.valid).toBe(false);
      expect(resultado.error).toContain('confiável');
    });

    it('deve rejeitar domínio suspeito', () => {
      const resultado = validateEmailSecurity('user@fake-email-provider.net');
      expect(resultado.valid).toBe(false);
    });
  });
});
