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
    <footer className="border-t border-white/10 bg-black pb-20 text-white md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-4">
        <div>
          <Logo variant="black-bg" height={56} />
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {storeSettings.tagline}
          </p>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-wide text-zinc-400">
            Navegação
          </p>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li><Link href="/colecao" className="hover:text-white">Coleção</Link></li>
            <li><Link href="/categorias" className="hover:text-white">Categorias</Link></li>
            <li><Link href="/sobre" className="hover:text-white">Sobre a loja</Link></li>
            <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-wide text-zinc-400">
            Atendimento
          </p>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li><Link href="/trocas" className="hover:text-white">Trocas e devoluções</Link></li>
            <li><Link href="/guia-de-tamanhos" className="hover:text-white">Guia de tamanhos</Link></li>
            <li><Link href="/favoritos" className="hover:text-white">Meus favoritos</Link></li>
            <li><Link href="/carrinho" className="hover:text-white">Meu carrinho</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-wide text-zinc-400">
            Fale conosco
          </p>
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <a
              href={buildSimpleWhatsAppUrl(storeSettings)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              WhatsApp
            </a>
            <a
              href={`https://instagram.com/${storeSettings.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
              {storeSettings.instagram}
            </a>
            <p className="text-white/60">{storeSettings.address}</p>
            <p className="text-white/60">{storeSettings.hours}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-white/10 px-6 py-5 text-center text-xs text-white/50 sm:px-8">
        <p>© {new Date().getFullYear()} {storeSettings.name}. Todos os direitos reservados.</p>
        <Link href="/admin/login" className="underline underline-offset-4 opacity-60 hover:opacity-100">
          Painel administrativo
        </Link>
      </div>
    </footer>
  );
}
