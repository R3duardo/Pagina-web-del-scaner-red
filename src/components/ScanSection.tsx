import SearchBar from "@/components/SearchBar";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import ScanIcon from "@/components/icons/ScanIcon";
import RefreshIcon from "@/components/icons/RefreshIcon";

interface ScanSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onScan: () => void;
  onRefresh: () => void;
  scanning: boolean;
  loading: boolean;
}

export default function ScanSection({
  searchQuery,
  onSearchChange,
  onScan,
  onRefresh,
  scanning,
  loading
}: ScanSectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-700/30 rounded-2xl p-3 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
          <div className="flex-1 w-full">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              onClick={onScan}
              disabled={scanning}
              className="group relative px-4 py-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-red-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                {scanning ? (
                  <>
                    <div className="relative">
                      <SpinnerIcon />
                    </div>
                    <span>Escaneando Red...</span>
                  </>
                ) : (
                  <>
                    <ScanIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Iniciar Escaneo</span>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="group relative px-4 py-2 bg-neutral-800/50 border border-neutral-600/50 text-neutral-300 font-semibold text-lg rounded-2xl hover:bg-neutral-700/50 hover:border-neutral-500/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer"
            >
              <RefreshIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}