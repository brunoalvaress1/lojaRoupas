"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { useAppData } from "@/context/AppDataContext";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  const { settings: storeSettings } = useAppData();

  return (
    <footer className="border-t border-border bg-background pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-4">
        <div>
          <Logo height={48} />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {storeSettings.tagline}
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest-xs text-muted-foreground">
            Navegação
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/colecao">Coleção</Link></li>
            <li><Link href="/categorias">Categorias</Link></li>
            <li><Link href="/sobre">Sobre a loja</Link></li>
            <li><Link href="/contato">Contato</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest-xs text-muted-foreground">
            Atendimento
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/trocas">Trocas e devoluções</Link></li>
            <li><Link href="/guia-de-tamanhos">Guia de tamanhos</Link></li>
            <li><Link href="/favoritos">Meus favoritos</Link></li>
            <li><Link href="/carrinho">Meu carrinho</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest-xs text-muted-foreground">
            Fale conosco
          </p>
          <div className="flex flex-col gap-3 text-sm">
            <a
              href={buildSimpleWhatsAppUrl(storeSettings)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              WhatsApp
            </a>
            <a
              href={`https://instagram.com/${storeSettings.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <InstagramIcon className="h-4 w-4" />
              {storeSettings.instagram}
            </a>
            <p className="text-muted-foreground">{storeSettings.address}</p>
            <p className="text-muted-foreground">{storeSettings.hours}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-border px-6 py-5 text-center text-xs text-muted-foreground sm:px-8">
        <p>© {new Date().getFullYear()} {storeSettings.name}. Todos os direitos reservados.</p>
        <Link href="/admin/login" className="underline underline-offset-4 opacity-60 hover:opacity-100">
          Painel administrativo
        </Link>
      </div>
    </footer>
  );
}
