export const capitalizar = (valor?: string | null): string => {
  if (!valor) return '';
  const limpio = valor.trim();
  if (!limpio) return '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

export const fmtMoney = (valor?: number | string | null): string => {
  const num = Number(valor);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

