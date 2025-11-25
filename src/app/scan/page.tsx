'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout, Header } from '@/components/layout';
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/common';
import { ScanIcon, RefreshIcon, NetworkIcon, ClockIcon, ChevronDownIcon, SettingsIcon } from '@/components/icons';
import { useScanStatus } from '@/hooks/useStats';
import { useScan } from '@/contexts/ScanContext';
import { formatDate } from '@/utils/formatters';
import api from '@/services/api';

interface PortInfo {
  port: number;
  service: string;
  protocol: string;
  category: string;
  security: 'secure' | 'caution' | 'warning' | 'insecure' | 'unknown';
}

function ScanContent() {
  const router = useRouter();
  const { status, refetch: refetchStatus } = useScanStatus();
  const { isScanning, startScan, onScanComplete } = useScan();
  const [network, setNetwork] = useState('');
  const [timeout, setTimeoutValue] = useState('2000');
  const [concurrency, setConcurrency] = useState('50');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanningIP, setScanningIP] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  
  // Estado para puertos
  const [portsMode, setPortsMode] = useState<'common' | 'custom' | 'range'>('common');
  const [customPorts, setCustomPorts] = useState('');
  const [portRangeStart, setPortRangeStart] = useState('1');
  const [portRangeEnd, setPortRangeEnd] = useState('1024');
  const [availablePorts, setAvailablePorts] = useState<PortInfo[]>([]);
  const [selectedPorts, setSelectedPorts] = useState<Set<number>>(new Set());
  const [showPortSelector, setShowPortSelector] = useState(false);

  // Cargar configuración del usuario
  useEffect(() => {
    const loadUserConfig = async () => {
      try {
        setConfigLoading(true);
        const result = await api.getConfig();
        if (result.success && result.configuracion) {
          const userNetwork = result.configuracion.red_escaneo;
          if (userNetwork && userNetwork.trim() !== '') {
            setNetwork(userNetwork);
            setHasConfig(true);
          } else {
            setHasConfig(false);
          }
          // Cargar otros valores de configuración
          if (result.configuracion.timeout_ms) {
            setTimeoutValue(String(result.configuracion.timeout_ms));
          }
          if (result.configuracion.concurrencia) {
            setConcurrency(String(result.configuracion.concurrencia));
          }
        } else {
          // No hay configuración - mostrar pantalla visual
          setHasConfig(false);
        }
      } catch {
        // Error al cargar - mostrar pantalla visual para configurar
        setHasConfig(false);
      } finally {
        setConfigLoading(false);
      }
    };
    loadUserConfig();
  }, []);

  // Cargar puertos disponibles
  useEffect(() => {
    const loadPorts = async () => {
      try {
        const result = await api.getAvailablePorts();
        if (result.success) {
          setAvailablePorts(result.portsWithInfo);
          // Seleccionar todos por defecto
          setSelectedPorts(new Set(result.commonPorts));
        }
      } catch {
        // Silenciar error - usar puertos vacíos
      }
    };
    loadPorts();
  }, []);

  // Actualizar cuando termine el escaneo
  useEffect(() => {
    onScanComplete(() => {
      refetchStatus();
      setScanResult('Escaneo completado exitosamente');
    });
  }, [onScanComplete, refetchStatus]);

  const getPortsString = (): string | undefined => {
    switch (portsMode) {
      case 'common':
        // Si no se seleccionaron todos, enviar solo los seleccionados
        if (selectedPorts.size < availablePorts.length && selectedPorts.size > 0) {
          return Array.from(selectedPorts).join(',');
        }
        return undefined; // Usar default del backend
      case 'custom':
        return customPorts || undefined;
      case 'range':
        const start = parseInt(portRangeStart);
        const end = parseInt(portRangeEnd);
        if (start && end && start <= end) {
          return `${start}-${end}`;
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleScan = async () => {
    // Verificar que hay red configurada
    if (!network || network.trim() === '') {
      setScanResult('Error: Debes configurar una red antes de escanear. Ve a Configuración.');
      return;
    }

    setScanResult(null);
    
    const ports = getPortsString();
    
    const started = await startScan({
      network,
      timeout: parseInt(timeout),
      concurrency: parseInt(concurrency),
      ports
    });

    if (started) {
      const portInfo = ports ? ` (${ports.split(',').length > 10 ? ports.split(',').length + ' puertos' : ports})` : ' (puertos comunes)';
      setScanResult(`Escaneo iniciado${portInfo}. Los resultados aparecerán cuando termine...`);
    } else {
      setScanResult('Ya hay un escaneo en progreso. Espere a que termine.');
    }
  };

  const handleScanIP = async (ip: string) => {
    try {
      setScanningIP(true);
      const result = await api.scanIP(ip);
      setScanResult(`IP ${ip} escaneada: ${result.success ? 'Activo' : 'No responde'}`);
      refetchStatus();
    } catch {
      setScanResult(`Error al escanear ${ip}`);
    } finally {
      setScanningIP(false);
    }
  };

  const togglePort = (port: number) => {
    const newSelected = new Set(selectedPorts);
    if (newSelected.has(port)) {
      newSelected.delete(port);
    } else {
      newSelected.add(port);
    }
    setSelectedPorts(newSelected);
  };

  const selectAllPorts = () => {
    setSelectedPorts(new Set(availablePorts.map(p => p.port)));
  };

  const clearAllPorts = () => {
    setSelectedPorts(new Set());
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'secure': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'caution': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'insecure': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  // Si está cargando la configuración
  if (configLoading) {
    return (
      <>
        <Header
          title="Escaneo de Red"
          subtitle="Configurar y ejecutar escaneos"
          showScan={false}
        />
        <div className="p-6 flex items-center justify-center">
          <div className="text-neutral-400">Cargando configuración...</div>
        </div>
      </>
    );
  }

  // Si no hay red configurada
  if (!hasConfig) {
    return (
      <>
        <Header
          title="Escaneo de Red"
          subtitle="Configurar y ejecutar escaneos"
          showScan={false}
        />
        <div className="p-6">
          <Card className="max-w-xl mx-auto">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-100 mb-2">
                Configuración Requerida
              </h2>
              <p className="text-neutral-400 mb-6">
                Para poder realizar escaneos, primero debes configurar la red que deseas escanear.
                <br />
                <span className="text-sm text-neutral-500">
                  Ejemplo: 192.168.1.0/24, 10.0.0.0/24
                </span>
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/settings')}
                icon={<SettingsIcon className="w-4 h-4" />}
              >
                Ir a Configuración
              </Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Escaneo de Red"
        subtitle="Configurar y ejecutar escaneos"
        showScan={false}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scan Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Escaneo</CardTitle>
            </CardHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Red a escanear (CIDR)
                </label>
                <Input
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  placeholder="192.168.1.0/24"
                  icon={<NetworkIcon className="w-4 h-4" />}
                  disabled={isScanning}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Timeout (ms)
                  </label>
                  <Input
                    type="number"
                    value={timeout}
                    onChange={(e) => setTimeoutValue(e.target.value)}
                    placeholder="2000"
                    disabled={isScanning}
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Concurrencia
                  </label>
                  <Input
                    type="number"
                    value={concurrency}
                    onChange={(e) => setConcurrency(e.target.value)}
                    placeholder="50"
                    disabled={isScanning}
                  />
                </div>
              </div>

              {/* Selector de puertos */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Puertos a escanear
                </label>
                
                {/* Tabs de modo */}
                <div className="flex gap-1 p-1 bg-neutral-800 rounded-lg mb-3">
                  <button
                    onClick={() => setPortsMode('common')}
                    disabled={isScanning}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      portsMode === 'common' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Comunes ({selectedPorts.size})
                  </button>
                  <button
                    onClick={() => setPortsMode('custom')}
                    disabled={isScanning}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      portsMode === 'custom' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Personalizado
                  </button>
                  <button
                    onClick={() => setPortsMode('range')}
                    disabled={isScanning}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      portsMode === 'range' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Rango
                  </button>
                </div>

                {/* Contenido según modo */}
                {portsMode === 'common' && (
                  <div>
                    <button
                      onClick={() => setShowPortSelector(!showPortSelector)}
                      disabled={isScanning}
                      className="w-full flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors"
                    >
                      <span className="text-sm text-neutral-300">
                        {selectedPorts.size} puertos seleccionados
                      </span>
                      <ChevronDownIcon className={`w-4 h-4 text-neutral-400 transition-transform ${showPortSelector ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showPortSelector && (
                      <div className="mt-2 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={selectAllPorts}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Seleccionar todos
                          </button>
                          <span className="text-neutral-600">|</span>
                          <button
                            onClick={clearAllPorts}
                            className="text-xs text-neutral-400 hover:text-neutral-300"
                          >
                            Limpiar
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                          {availablePorts.map((p) => (
                            <button
                              key={p.port}
                              onClick={() => togglePort(p.port)}
                              className={`
                                p-2 rounded text-xs text-left transition-all border
                                ${selectedPorts.has(p.port)
                                  ? getSecurityColor(p.security)
                                  : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-700'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-medium">{p.port}</span>
                                <span className={`text-[9px] px-1 rounded ${
                                  p.protocol === 'UDP' ? 'bg-purple-500/20 text-purple-400' :
                                  p.protocol === 'TCP/UDP' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-neutral-600/20 text-neutral-500'
                                }`}>
                                  {p.protocol}
                                </span>
                              </div>
                              <span className="block text-[10px] opacity-70">{p.service}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {portsMode === 'custom' && (
                  <div>
                    <Input
                      value={customPorts}
                      onChange={(e) => setCustomPorts(e.target.value)}
                      placeholder="22, 80, 443, 3000-3010"
                      disabled={isScanning}
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Separa con comas. Usa guión para rangos: 80, 443, 8000-8100
                    </p>
                  </div>
                )}

                {portsMode === 'range' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Desde</label>
                      <Input
                        type="number"
                        value={portRangeStart}
                        onChange={(e) => setPortRangeStart(e.target.value)}
                        placeholder="1"
                        min="1"
                        max="65535"
                        disabled={isScanning}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Hasta</label>
                      <Input
                        type="number"
                        value={portRangeEnd}
                        onChange={(e) => setPortRangeEnd(e.target.value)}
                        placeholder="1024"
                        min="1"
                        max="65535"
                        disabled={isScanning}
                      />
                    </div>
                    <p className="col-span-2 text-xs text-neutral-500">
                      Rango: {parseInt(portRangeEnd) - parseInt(portRangeStart) + 1} puertos
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleScan}
                loading={isScanning}
                disabled={isScanning}
                icon={<ScanIcon className="w-4 h-4" />}
              >
                {isScanning ? 'Escaneando...' : 'Iniciar Escaneo'}
              </Button>

              {scanResult && (
                <div className={`p-3 rounded-lg border ${
                  scanResult.includes('error') || scanResult.includes('Error') || scanResult.includes('progreso')
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  <p className="text-sm">{scanResult}</p>
                </div>
              )}

              {/* Progress indicator */}
              {isScanning && (
                <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm text-neutral-200">Escaneo en progreso</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    El escaneo se está ejecutando en el backend. Esta página se actualizará automáticamente cuando termine.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Scan Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Estado del Sistema</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetchStatus}
                  icon={<RefreshIcon className="w-4 h-4" />}
                >
                  Actualizar
                </Button>
              </div>
            </CardHeader>

            {status ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatItem
                    label="Total Equipos"
                    value={status.equipos?.total_equipos || 0}
                  />
                  <StatItem
                    label="Equipos Activos"
                    value={status.equipos?.equipos_activos || 0}
                  />
                  <StatItem
                    label="Registros de Puertos"
                    value={status.puertos?.total_registros || 0}
                  />
                  <StatItem
                    label="Equipos con Puertos"
                    value={status.puertos?.equipos_con_puertos || 0}
                  />
                </div>

                {status.equipos?.ultimo_escaneo && (
                  <div className="pt-4 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <ClockIcon className="w-4 h-4" />
                      <span>Último escaneo:</span>
                      <span className="text-neutral-300">
                        {formatDate(status.equipos.ultimo_escaneo)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Cargando estado...</p>
            )}
          </Card>
        </div>

        {/* Quick Scan */}
        <Card>
          <CardHeader>
            <CardTitle>Escaneo Rápido de IP</CardTitle>
          </CardHeader>
          <QuickScan onScan={handleScanIP} scanning={scanningIP || isScanning} />
        </Card>

        {/* Info */}
        <Card className="bg-neutral-800/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <NetworkIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-200 mb-1">Información del Escaneo</h3>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>• El escaneo detecta dispositivos activos mediante ping</li>
                <li>• Puedes seleccionar puertos comunes, escribir una lista personalizada, o definir un rango</li>
                <li>• Los puertos no se duplican si fueron detectados en los últimos 10 minutos</li>
                <li>• Se identifica el sistema operativo por TTL y el fabricante por MAC</li>
                <li>• No se puede iniciar un nuevo escaneo mientras hay uno en progreso</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default function ScanPage() {
  return (
    <MainLayout>
      <ScanContent />
    </MainLayout>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg bg-neutral-800/50">
      <p className="text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-neutral-200">{value}</p>
    </div>
  );
}

function QuickScan({ onScan, scanning }: { onScan: (ip: string) => void; scanning: boolean }) {
  const [ip, setIp] = useState('');

  return (
    <div className="flex gap-3">
      <Input
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="Ej: 192.168.1.1"
        className="flex-1"
        disabled={scanning}
      />
      <Button
        variant="secondary"
        onClick={() => ip && onScan(ip)}
        loading={scanning}
        disabled={!ip || scanning}
      >
        Escanear IP
      </Button>
    </div>
  );
}
