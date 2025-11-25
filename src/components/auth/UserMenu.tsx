'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDownIcon } from '@/components/icons';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  const displayName = user.nombreCompleto || user.username;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-400">
            {initials}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm text-neutral-200">{displayName}</p>
          <p className="text-xs text-neutral-500 capitalize">{user.rol}</p>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-neutral-800">
            <p className="text-sm text-neutral-200">{displayName}</p>
            <p className="text-xs text-neutral-500">@{user.username}</p>
          </div>
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 rounded transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
