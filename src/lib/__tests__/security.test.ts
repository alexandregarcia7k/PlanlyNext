import { describe, it, expect } from 'vitest';
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
  isValidEmailFormat,
  validateFormField,
} from '../security';

describe('Security Utils', () => {
  describe('containsSQLInjection', () => {
    it('deve detectar comandos SQL básicos', () => {
      expect(containsSQLInjection("SELECT * FROM users")).toBe(true);
      expect(containsSQLInjection("DROP TABLE users")).toBe(true);
      expect(containsSQLInjection("INSERT INTO users")).toBe(true);
      expect(containsSQLInjection("UPDATE users SET")).toBe(true);
      expect(containsSQLInjection("DELETE FROM users")).toBe(true);
    });

    it('deve detectar UNION attacks', () => {
      expect(containsSQLInjection("' UNION SELECT password FROM users--")).toBe(true);
      expect(containsSQLInjection("1' UNION ALL SELECT NULL--")).toBe(true);
    });

    it('deve detectar comentários SQL', () => {
      expect(containsSQLInjection("admin'--")).toBe(true);
      expect(containsSQLInjection("test /* comment */")).toBe(true);
      expect(containsSQLInjection("value #comment")).toBe(true);
    });

    it('deve detectar aspas e caracteres de escape', () => {
      expect(containsSQLInjection("test'test")).toBe(true);
      expect(containsSQLInjection('test"test')).toBe(true);
      expect(containsSQLInjection("test`test")).toBe(true);
      expect(containsSQLInjection("test;test")).toBe(true);
      expect(containsSQLInjection("test\\test")).toBe(true);
    });

    it('deve aceitar texto normal', () => {
      expect(containsSQLInjection("Olá, meu nome é João")).toBe(false);
      expect(containsSQLInjection("Endereço: Rua 123")).toBe(false);
      expect(containsSQLInjection("Email: teste@gmail.com")).toBe(false);
    });

    it('deve lidar com strings vazias e null', () => {
      expect(containsSQLInjection("")).toBe(false);
      // @ts-expect-error - testando null
      expect(containsSQLInjection(null)).toBe(false);
      // @ts-expect-error - testando undefined
      expect(containsSQLInjection(undefined)).toBe(false);
    });
  });

  describe('containsXSS', () => {
    it('deve detectar tags script', () => {
      expect(containsXSS("<script>alert('xss')</script>")).toBe(true);
      expect(containsXSS("<SCRIPT>alert('xss')</SCRIPT>")).toBe(true);
      expect(containsXSS("<script src='evil.js'></script>")).toBe(true);
    });

    it('deve detectar iframes', () => {
      expect(containsXSS("<iframe src='evil.com'></iframe>")).toBe(true);
      expect(containsXSS("<IFRAME></IFRAME>")).toBe(true);
    });

    it('deve detectar javascript: protocol', () => {
      expect(containsXSS("javascript:alert('xss')")).toBe(true);
      expect(containsXSS("JAVASCRIPT:alert(1)")).toBe(true);
    });

    it('deve detectar event handlers', () => {
      expect(containsXSS("onclick=alert(1)")).toBe(true);
      expect(containsXSS("onerror=alert('xss')")).toBe(true);
      expect(containsXSS("onload=malicious()")).toBe(true);
    });

    it('deve aceitar HTML seguro', () => {
      expect(containsXSS("<p>Texto normal</p>")).toBe(false);
      expect(containsXSS("<div>Conteúdo</div>")).toBe(false);
      expect(containsXSS("<b>Negrito</b>")).toBe(false);
    });

    it('deve aceitar texto sem HTML', () => {
      expect(containsXSS("Texto normal sem tags")).toBe(false);
      expect(containsXSS("Email: test@example.com")).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('deve remover nullbytes', () => {
      const result = sanitizeInput("test\0test");
      expect(result).toBe("testtest");
    });

    it('deve remover caracteres de controle', () => {
      const result = sanitizeInput("test\x00\x08test");
      expect(result).toBe("testtest");
    });

    it('deve fazer trim e normalizar espaços', () => {
      const result = sanitizeInput("  test   múltiplos    espaços  ");
      expect(result).toBe("test múltiplos espaços");
    });

    it('deve manter texto normal', () => {
      const result = sanitizeInput("Texto normal com acentuação");
      expect(result).toBe("Texto normal com acentuação");
    });

    it('deve lidar com strings vazias', () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   ")).toBe("");
    });

    it('deve lidar com null e undefined', () => {
      // @ts-expect-error - testando null
      expect(sanitizeInput(null)).toBe("");
      // @ts-expect-error - testando undefined
      expect(sanitizeInput(undefined)).toBe("");
    });
  });

  describe('isValidEmailFormat', () => {
    it('deve aceitar emails válidos', () => {
      expect(isValidEmailFormat("usuario@exemplo.com")).toBe(true);
      expect(isValidEmailFormat("nome.sobrenome@dominio.com.br")).toBe(true);
      expect(isValidEmailFormat("user+tag@example.com")).toBe(true);
      expect(isValidEmailFormat("user123@test-domain.com")).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      expect(isValidEmailFormat("")).toBe(false);
      expect(isValidEmailFormat("sem-arroba")).toBe(false);
      expect(isValidEmailFormat("@semlocal.com")).toBe(false);
      expect(isValidEmailFormat("usuario@")).toBe(false);
      expect(isValidEmailFormat("usuario@semtld")).toBe(false);
    });

    it('deve rejeitar local part com pontos problemáticos', () => {
      expect(isValidEmailFormat(".usuario@exemplo.com")).toBe(false);
      expect(isValidEmailFormat("usuario.@exemplo.com")).toBe(false);
      expect(isValidEmailFormat("usuario..teste@exemplo.com")).toBe(false);
    });

    it('deve rejeitar domínio sem TLD', () => {
      expect(isValidEmailFormat("usuario@localhost")).toBe(false);
    });

    it('deve rejeitar emails com SQL injection óbvios', () => {
      // Nota: aspas simples são tecnicamente válidas em RFC 5322, mas devem ser detectadas
      // pela função containsSQLInjection() antes de chegar ao isValidEmailFormat()
      expect(isValidEmailFormat("test@example.com; DROP TABLE")).toBe(false);
      expect(isValidEmailFormat("test@example.com--")).toBe(false);
      expect(isValidEmailFormat("test@example.com/**/")).toBe(false);
    });

    it('deve lidar com null e undefined', () => {
      // @ts-expect-error - testando null
      expect(isValidEmailFormat(null)).toBe(false);
      // @ts-expect-error - testando undefined
      expect(isValidEmailFormat(undefined)).toBe(false);
    });
  });

  describe('validateFormField', () => {
    it('deve validar campo obrigatório', () => {
      const result = validateFormField('nome', '');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('deve validar tamanho mínimo', () => {
      const result = validateFormField('nome', 'ab', { minLength: 3 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('mínimo');
    });

    it('deve validar tamanho máximo', () => {
      const result = validateFormField('nome', 'a'.repeat(1001), { maxLength: 1000 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('máximo');
    });

    it('deve detectar SQL injection', () => {
      const result = validateFormField('mensagem', "test'; DROP TABLE users--", { checkSQL: true });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('não permitidos');
    });

    it('deve detectar XSS', () => {
      const result = validateFormField('mensagem', "<script>alert('xss')</script>", {
        checkXSS: true,
        allowHTML: false,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('não permitido');
    });

    it('deve aceitar campo válido', () => {
      const result = validateFormField('nome', 'João Silva', {
        minLength: 2,
        maxLength: 100,
      });
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('João Silva');
    });

    it('deve permitir HTML quando configurado', () => {
      const result = validateFormField('descricao', '<p>Texto</p>', {
        allowHTML: true,
        checkXSS: false,
      });
      expect(result.valid).toBe(true);
    });

    it('deve sanitizar input', () => {
      const result = validateFormField('nome', '  João   Silva  ', {});
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('João Silva');
    });
  });

  describe('Integração - Casos reais de ataque', () => {
    it('deve bloquear tentativa real de SQL injection', () => {
      const attacks = [
        "admin' OR '1'='1",
        "' UNION SELECT password FROM users--",
        "1; DROP TABLE users--",
        "admin'--",
        "' OR 1=1--",
      ];

      attacks.forEach(attack => {
        expect(containsSQLInjection(attack)).toBe(true);
      });
    });

    it('deve bloquear tentativas reais de XSS', () => {
      const attacks = [
        "<script>alert(document.cookie)</script>",
        "<img src=x onerror=alert(1)>",
        "<iframe src='javascript:alert(1)'>",
        "<body onload=alert('xss')>",
      ];

      attacks.forEach(attack => {
        expect(containsXSS(attack)).toBe(true);
      });
    });

    it('deve aceitar conteúdo legítimo', () => {
      const legitimate = [
        "Olá, gostaria de saber mais sobre o produto",
        "Meu email é joao@empresa.com.br",
        "Telefone: (11) 99999-9999",
        "Endereço: Rua das Flores, 123",
      ];

      legitimate.forEach(content => {
        expect(containsSQLInjection(content)).toBe(false);
        expect(containsXSS(content)).toBe(false);
      });
    });
  });
});
