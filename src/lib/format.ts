export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatInstallments(value: number, count = 6) {
  const installment = value / count;
  return `ou ${count}x de ${formatPrice(installment)} sem juros`;
}
