import type { Metadata } from "next";
import Image from "next/image";
import { SizeTabs } from "@/components/product/SizeTabs";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getSizeGuide } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Guia de Tamanhos",
  description: "Consulte as medidas para escolher o tamanho ideal.",
};

export default async function GuiaDeTamanhosPage() {
  const [feminino, masculino] = await Promise.all([
    getSizeGuide("feminino"),
    getSizeGuide("masculino"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Guia de Tamanhos" }]}
      />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl">Guia de Tamanhos</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <SizeTabs feminino={feminino} masculino={masculino} />

        <div className="relative hidden aspect-[3/4] overflow-hidden bg-muted md:block">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format&fit=crop"
            alt="Modelo vestindo peça da coleção"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
