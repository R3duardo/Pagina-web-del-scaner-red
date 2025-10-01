import EmptyStateIcon from "@/components/icons/EmptyStateIcon";

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export default function EmptyState({ hasSearchQuery }: EmptyStateProps) {
  return (
    <div className="text-center py-40">
      <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-sm rounded-3xl p-16 border border-neutral-700/50 max-w-2xl mx-auto">
        <EmptyStateIcon className="mx-auto h-40 w-40 text-neutral-600 mb-8" />
        <h3 className="text-3xl font-bold text-neutral-300 mb-6">
          No se encontraron hosts
        </h3>
        <p className="text-neutral-400 text-xl leading-relaxed">
          {hasSearchQuery
            ? "Intenta con otra búsqueda o limpia el filtro"
            : 'Haz clic en "Iniciar Escaneo" para buscar dispositivos en tu red'}
        </p>
      </div>
    </div>
  );
}