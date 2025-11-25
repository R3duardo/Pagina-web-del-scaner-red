'use client';

import { useState } from 'react';
import { MainLayout, Header } from '@/components/layout';
import { HostList, HostsTable } from '@/components/hosts';
import { Button, Card } from '@/components/common';
import { useHosts, useHostSearch } from '@/hooks/useHosts';
import { HostsIcon } from '@/components/icons';

type ViewMode = 'cards' | 'table';

export default function HostsPage() {
  const { hosts, loading, refetch } = useHosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  const filteredHosts = useHostSearch(hosts, searchQuery);

  return (
    <MainLayout>
      <Header
        title="Dispositivos"
        subtitle={`${filteredHosts.length} dispositivos encontrados`}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={refetch}
      />

      <div className="p-6">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Tarjetas
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Tabla
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <HostList
            hosts={filteredHosts}
            loading={loading}
            emptyMessage="No se encontraron dispositivos"
          />
        ) : (
          <Card>
            <HostsTable hosts={filteredHosts} />
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

