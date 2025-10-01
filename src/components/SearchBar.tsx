'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Buscar por IP" }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="relative bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex items-center px-2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 mr-3 flex-shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-neutral-400 focus:outline-none text-sm sm:text-base p-2"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="ml-3 p-1 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}