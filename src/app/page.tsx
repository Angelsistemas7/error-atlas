import SearchBox from "@/components/SearchBox";
import { getAllErrors } from "@/lib/errors";

export default function Home() {
  const errors = getAllErrors();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Error Atlas</h1>
        <p className="text-neutral-500 max-w-lg">
          Una wikipedia técnica de errores reales: causas, soluciones ordenadas
          por probabilidad y contexto — no otro hilo de foro a medio responder.
        </p>
      </div>

      <SearchBox errors={errors} />

      <p className="text-xs text-neutral-400">
        {errors.length} errores documentados hasta ahora — sumando cada semana.
      </p>
    </main>
  );
}
