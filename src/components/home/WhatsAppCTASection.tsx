"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { useAppData } from "@/context/AppDataContext";

export function WhatsAppCTASection() {
  const { settings } = useAppData();

  return (
    <section className="relative overflow-hidden bg-accent px-6 py-20 text-center text-accent-foreground sm:py-28">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 top-0 h-px origin-center bg-accent-foreground/30"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-xl"
      >
        <h2 className="font-display text-3xl sm:text-4xl">
          Gostou de alguma peça?
        </h2>
        <p className="mt-4 text-sm text-accent-foreground/80 sm:text-base">
          Monte seu carrinho e fale com nossa equipe pelo WhatsApp. Nossa
          equipe confirma disponibilidade e finaliza seu pedido com você.
        </p>
        <a
          href={buildSimpleWhatsAppUrl(settings)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-accent-foreground px-8 py-3 text-xs font-medium uppercase tracking-widest-xs text-accent transition-opacity hover:opacity-85"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          Falar no WhatsApp
        </a>
      </motion.div>
    </section>
  );
}
