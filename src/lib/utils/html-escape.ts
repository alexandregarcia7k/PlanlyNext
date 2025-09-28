/**
 * Escapa caracteres HTML para prevenir XSS
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Converte quebras de linha para <br> de forma segura
 */
export function nlToBr(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}