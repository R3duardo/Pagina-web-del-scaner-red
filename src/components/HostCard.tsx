import { Host } from '@/types/network';
import PortsList from './PortsList';

interface HostCardProps {
  host: Host;
}

export default function HostCard({ host }: HostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden hover:shadow-red-500/30 hover:border-red-500/70 transition-all duration-500 h-full hover-lift animate-fadeInScale floating-particles">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
      
      {/* Header with improved design */}
      <div className="relative bg-gradient-to-r from-red-600/90 via-pink-600/90 to-purple-600/90 backdrop-blur-sm px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-white font-mono tracking-tight">
              {host.ip_address}
            </h3>
            {host.hostname && (
              <p className="text-pink-100 text-lg font-medium">{host.hostname}</p>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-1 ml-6 sm:block hidden">
            <div className="flex gap-2">
              <p className="text-lg uppercase tracking-wider font-semibold mb-1">ID</p>
              <span className="text-white text-lg font-bold">
                {host.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">MAC Address</p>
            </div>
            <p className="text-white font-mono text-base break-all leading-relaxed">
              {host.mac_address || 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Última vez visto</p>
            </div>
            <p className="text-white text-base font-medium">
              {formatDate(host.last_seen)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex-1">
          <PortsList ports={host.ports} />
        </div>
      </div>
    </div>
  );
}