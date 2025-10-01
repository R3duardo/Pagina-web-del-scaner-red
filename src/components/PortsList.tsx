import { Port } from '@/types/network';

interface PortsListProps {
  ports: Port[];
}

const getServiceColor = (serviceName: string): string => {
  const colors: Record<string, string> = {
    'HTTP': 'bg-green-500/20 text-green-400 border-green-500/50',
    'HTTPS': 'bg-green-500/20 text-green-400 border-green-500/50',
    'SSH': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    'FTP': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    'DNS': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'MySQL': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    'SMB': 'bg-red-500/20 text-red-400 border-red-500/50',
  };
  
  return colors[serviceName] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
};

export default function PortsList({ ports }: PortsListProps) {
  if (ports.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No se encontraron puertos abiertos
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
        Puertos Abiertos ({ports.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ports.map((port) => (
          <div
            key={port.id}
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xl text-white">
                {port.port_number}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {port.protocol}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getServiceColor(port.service_name)}`}>
              {port.service_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}