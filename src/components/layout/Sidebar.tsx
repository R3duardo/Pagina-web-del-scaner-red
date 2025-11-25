'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  DashboardIcon,
  HostsIcon,
  SecurityIcon,
  ReportsIcon,
  ScanIcon,
  SettingsIcon,
  NetworkIcon,
  ChevronRightIcon,
} from '@/components/icons';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: DashboardIcon },
  { name: 'Dispositivos', href: '/hosts', icon: HostsIcon },
  { name: 'Seguridad', href: '/security', icon: SecurityIcon },
  { name: 'Reportes', href: '/reports', icon: ReportsIcon },
  { name: 'Escaneo', href: '/scan', icon: ScanIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-neutral-950 border-r border-neutral-800
        flex flex-col z-40 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <NetworkIcon className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-sm text-neutral-200">NetScanner</span>
          </div>
        )}
        {collapsed && <NetworkIcon className="w-6 h-6 text-blue-500 mx-auto" />}
        <button
          onClick={toggle}
          className="p-1 hover:bg-neutral-800 rounded transition-colors"
        >
          <ChevronRightIcon
            className={`w-4 h-4 text-neutral-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }
              `}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        <Link
          href="/settings"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-md text-sm
            ${pathname === '/settings' 
              ? 'bg-blue-600/10 text-blue-400' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }
            transition-colors
          `}
          title={collapsed ? 'Configuración' : undefined}
        >
          <SettingsIcon className="w-5 h-5" />
          {!collapsed && <span>Configuración</span>}
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
