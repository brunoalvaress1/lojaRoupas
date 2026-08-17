import { storeSettings } from "@/data/store-settings";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/types";

export function buildOrderMessage(items: CartItem[]) {
  const lines: string[] = [];

  lines.push(`Olá, ${storeSettings.name}! Tenho interesse nas peças abaixo:`);
  lines.push("");

  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`Código: ${item.reference}`);
    lines.push(`Cor: ${item.colorName}`);
    lines.push(`Tamanho: ${item.sizeLabel}`);
    lines.push(`Quantidade: ${item.quantity}`);
    lines.push(`Valor unitário: ${formatPrice(item.price)}`);
    lines.push(`Subtotal: ${formatPrice(subtotal)}`);
    lines.push("");
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  lines.push(`TOTAL: ${formatPrice(total)}`);
  lines.push("");
  lines.push(storeSettings.whatsappDefaultMessage);

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string, phone = storeSettings.whatsappNumber) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function buildSimpleWhatsAppUrl() {
  return buildWhatsAppUrl(storeSettings.whatsappDefaultMessage);
}
