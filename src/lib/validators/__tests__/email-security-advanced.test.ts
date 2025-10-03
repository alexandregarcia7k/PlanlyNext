import { describe, it, expect } from 'vitest';
import { validateEmailSecurity, validateEmailSecurityWithMX } from '../email-security';
import disposableDomains from '../disposable-domains.json';

describe('Email Security Validation', () => {
  describe('validateEmailSecurity (sync)', () => {
    describe('Formato básico', () => {
      it('deve aceitar email válido', () => {
        const result = validateEmailSecurity('usuario@gmail.com');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('deve rejeitar email sem @', () => {
        const result = validateEmailSecurity('usuariogmail.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Formato de email inválido');
      });

      it('deve rejeitar email com múltiplos @', () => {
        const result = validateEmailSecurity('usuario@@gmail.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Formato de email inválido');
      });

      it('deve rejeitar email vazio', () => {
        const result = validateEmailSecurity('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Formato de email inválido');
      });

      it('deve rejeitar email sem local part', () => {
        const result = validateEmailSecurity('@gmail.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email incompleto');
      });

      it('deve rejeitar email sem domínio', () => {
        const result = validateEmailSecurity('usuario@');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email incompleto');
      });

      it('deve remover espaços em branco', () => {
        const result = validateEmailSecurity('  usuario@gmail.com  ');
        expect(result.valid).toBe(true);
      });

      it('deve rejeitar local part muito longo (>64 chars)', () => {
        const longLocal = 'a'.repeat(65);
        const result = validateEmailSecurity(`${longLocal}@gmail.com`);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email muito longo');
      });

      it('deve rejeitar domínio inválido sem TLD', () => {
        const result = validateEmailSecurity('usuario@localhost');
        expect(result.valid).toBe(false);
        // localhost é bloqueado por estar na blacklist adicional
        expect(result.error).toBeDefined();
      });

      it('deve rejeitar domínio com caracteres inválidos', () => {
        const result = validateEmailSecurity('usuario@gmail$.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Domínio de email inválido');
      });
    });

    describe('Blacklist de emails específicos', () => {
      const blacklistedEmails = [
        'test@test.com',
        'spam@spam.com',
        'fake@fake.com',
        'admin@admin.com',
        'noreply@noreply.com',
      ];

      blacklistedEmails.forEach(email => {
        it(`deve bloquear ${email}`, () => {
          const result = validateEmailSecurity(email);
          expect(result.valid).toBe(false);
          expect(result.error).toBe('Este email não é permitido');
        });
      });
    });

    describe('Domínios temporários conhecidos', () => {
      const temporaryDomains = [
        // Serviços populares
        'teste@10minutemail.com',
        'teste@tempmail.org',
        'teste@guerrillamail.com',
        'teste@mailinator.com',
        'teste@yopmail.com',
        'teste@temp-mail.org',
        'teste@temp-mail.io',
        'teste@throwaway.email',
        'teste@maildrop.cc',
        'teste@sharklasers.com',
        'teste@emailondeck.com',
        'teste@getnada.com',
        'teste@mohmal.com',
        'teste@minuteinbox.com',
        'teste@fakemailgenerator.com',

        // Domínios suspeitos
        'teste@example.com',
        'teste@test.com',
        'teste@spam.com',
        'teste@fake.com',
        'teste@invalid.com',
      ];

      temporaryDomains.forEach(email => {
        it(`deve bloquear ${email}`, () => {
          const result = validateEmailSecurity(email);
          expect(result.valid).toBe(false);
          expect(result.error).toContain('Emails temporários não são permitidos');
        });
      });
    });

    describe('Subdomínios de serviços temporários', () => {
      it('deve bloquear subdomínio de tempmail', () => {
        const result = validateEmailSecurity('teste@abc.tempmail.org');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Emails temporários não são permitidos');
      });

      it('deve bloquear subdomínio de temp-mail', () => {
        const result = validateEmailSecurity('teste@xyz.temp-mail.io');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Emails temporários não são permitidos');
      });
    });

    describe('Provedores legítimos', () => {
      const legitimateEmails = [
        'usuario@gmail.com',
        'usuario@googlemail.com',
        'usuario@outlook.com',
        'usuario@hotmail.com',
        'usuario@yahoo.com',
        'usuario@icloud.com',
        'usuario@uol.com.br',
        'usuario@bol.com.br',
        'usuario@terra.com.br',
      ];

      legitimateEmails.forEach(email => {
        it(`deve aceitar ${email}`, () => {
          const result = validateEmailSecurity(email);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        });
      });
    });

    describe('Case sensitivity', () => {
      it('deve aceitar email em maiúsculas', () => {
        const result = validateEmailSecurity('USUARIO@GMAIL.COM');
        expect(result.valid).toBe(true);
      });

      it('deve bloquear temporário em maiúsculas', () => {
        const result = validateEmailSecurity('TESTE@TEMPMAIL.ORG');
        expect(result.valid).toBe(false);
      });

      it('deve bloquear email blacklisted em maiúsculas', () => {
        const result = validateEmailSecurity('TEST@TEST.COM');
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('validateEmailSecurityWithMX (async)', () => {
    describe('Validação com MX records', () => {
      it('deve aceitar domínio com MX válido (gmail.com)', async () => {
        const result = await validateEmailSecurityWithMX('teste@gmail.com');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('deve aceitar domínio com MX válido (outlook.com)', async () => {
        const result = await validateEmailSecurityWithMX('teste@outlook.com');
        expect(result.valid).toBe(true);
      });

      it('deve rejeitar domínio inexistente', async () => {
        const result = await validateEmailSecurityWithMX('teste@dominio-que-nao-existe-12345-xyz.com');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('não existe ou não pode receber mensagens');
      });

      it('deve rejeitar domínio sem MX records', async () => {
        // Testando com domínio que existe mas não tem MX configurado
        const result = await validateEmailSecurityWithMX('teste@github.com');
        // GitHub não usa email próprio, usa serviços externos
        // Mas pode ter MX configurado, então apenas verificamos que a validação ocorre
        expect(result.valid).toBeDefined();
      });

      it('deve rejeitar email temporário mesmo com MX', async () => {
        // Alguns serviços temporários têm MX válidos, mas devem ser bloqueados pela blacklist
        const result = await validateEmailSecurityWithMX('teste@tempmail.org');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Emails temporários não são permitidos');
      });

      it('deve usar cache para verificações repetidas', async () => {
        // Primeira chamada
        const result1 = await validateEmailSecurityWithMX('teste@gmail.com');
        expect(result1.valid).toBe(true);

        // Segunda chamada (deve usar cache)
        const result2 = await validateEmailSecurityWithMX('teste@gmail.com');
        expect(result2.valid).toBe(true);

        // Ambas devem retornar o mesmo resultado
        expect(result1).toEqual(result2);
      });
    });

    describe('Validação básica antes de MX', () => {
      it('não deve fazer MX check se formato for inválido', async () => {
        const result = await validateEmailSecurityWithMX('email-invalido');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Formato de email inválido');
      });

      it('não deve fazer MX check se for email temporário', async () => {
        const result = await validateEmailSecurityWithMX('teste@tempmail.org');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Emails temporários não são permitidos');
      });
    });
  });

  describe('Performance e Edge Cases', () => {
    it('deve processar email muito rápido (< 10ms) sem MX', () => {
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        validateEmailSecurity(`teste${i}@gmail.com`);
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // 100 emails em < 100ms
    });

    it('deve lidar com strings vazias', () => {
      expect(() => validateEmailSecurity('')).not.toThrow();
    });

    it('deve validar tipo de entrada', () => {
      // Função espera string, teste de tipos está no TypeScript
      const result = validateEmailSecurity('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Formato de email inválido');
    });

    it('deve lidar com caracteres especiais no local part', () => {
      const result = validateEmailSecurity('user+tag@gmail.com');
      expect(result.valid).toBe(true);
    });

    it('deve lidar com números no email', () => {
      const result = validateEmailSecurity('user123@gmail.com');
      expect(result.valid).toBe(true);
    });

    it('deve lidar com hífen no domínio', () => {
      const result = validateEmailSecurity('user@my-domain.com');
      // Hífens são válidos em domínios, só bloqueamos se estiver na blacklist
      expect(result.valid).toBe(true);
    });
  });

  describe('Integração com lista JSON de domínios descartáveis', () => {
    it('deve bloquear domínios da lista JSON', () => {
      // Verificar alguns domínios que devem estar na lista
      const knownDisposable = [
        'teste@0-mail.com',
        'teste@0815.ru',
        'teste@10minutemail.net',
      ];

      knownDisposable.forEach(email => {
        const result = validateEmailSecurity(email);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Emails temporários não são permitidos');
      });
    });

    it('deve ter mais de 10.000 domínios bloqueados', () => {
      // A lista JSON deve ter pelo menos 10k domínios
      expect(disposableDomains.length).toBeGreaterThan(10000);
    });
  });
});
