import type { SizeGuideRow } from "@/types";

export function SizeGuideTable({ rows }: { rows: SizeGuideRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest-xs text-muted-foreground">
            <th className="py-3 pr-4">Tamanho</th>
            <th className="py-3 pr-4">Busto</th>
            <th className="py-3 pr-4">Cintura</th>
            <th className="py-3">Quadril</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-b border-border">
              <td className="py-3 pr-4 font-medium">{row.size}</td>
              <td className="py-3 pr-4 text-muted-foreground">{row.busto}</td>
              <td className="py-3 pr-4 text-muted-foreground">{row.cintura}</td>
              <td className="py-3 text-muted-foreground">{row.quadril}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-muted-foreground">
        *Medidas aproximadas. Pode variar conforme o modelo da peça.
      </p>
    </div>
  );
}
