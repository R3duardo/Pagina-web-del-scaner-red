import { Host } from "@/types/network";
import HostCard from "@/components/HostCard";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";

interface ResultsSectionProps {
  hosts: Host[];
  loading: boolean;
  searchQuery: string;
}

export default function ResultsSection({ hosts, loading, searchQuery }: ResultsSectionProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (hosts.length === 0) {
    return <EmptyState hasSearchQuery={searchQuery.trim() !== ""} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Dispositivos Encontrados
        </h2>
        <div className="h-1 w-32 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center">
        {hosts.map((host, index) => (
          <div
            key={host.id}
            className="w-full max-w-2xl stagger-animation"
            style={{
              animationDelay: `${index * 150}ms`,
            }}
          >
            <HostCard host={host} />
          </div>
        ))}
      </div>
    </div>
  );
}