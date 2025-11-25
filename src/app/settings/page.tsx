'use client';

import { useState, useEffect } from 'react';
import { MainLayout, Header } from '@/components/layout';
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/common';
import { NetworkIcon, ClockIcon, SettingsIcon, SecurityIcon, CheckIcon } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

function SettingsContent() {
  const { user, config, updateConfig, refreshUser } = useAuth();
  const [localConfig, setLocalConfig] = useState({
    red_escaneo: '192.168.1.0/24',
    timeout_ms: 2000,
    concurrencia: 50,
    escaneo_automatico: false,
    intervalo_escaneo: 30,
    alertas_activas: true,
  });
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar configuración del usuario
  useEffect(() => {
    if (config) {
      setLocalConfig({
        red_escaneo: config.red_escaneo || '192.168.1.0/24',
        timeout_ms: config.timeout_ms || 2000,
        concurrencia: config.concurrencia || 50,
        escaneo_automatico: config.escaneo_automatico || false,
        intervalo_escaneo: config.intervalo_escaneo || 30,
        alertas_activas: config.alertas_activas ?? true,
      });
    }
    if (user) {
      setNombreCompleto(user.nombreCompleto || '');
    }
  }, [config, user]);

  const handleSaveConfig = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateConfig(localConfig);
      setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar configuración' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.updateProfile(nombreCompleto);
      await refreshUser();
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch {
      setMessage({ type: 'error', text: 'Error al actualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordNueva !== passwordConfirmar) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    if (passwordNueva.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const result = await api.changePassword(passwordActual, passwordNueva);
      if (result.success) {
        setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
        setPasswordActual('');
        setPasswordNueva('');
        setPasswordConfirmar('');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al cambiar contraseña' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header
        title="Configuración"
        subtitle="Ajustes del sistema"
        showScan={false}
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' && <CheckIcon className="w-4 h-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-neutral-400" />
              <CardTitle>Perfil de Usuario</CardTitle>
            </div>
          </CardHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Usuario
                </label>
                <Input
                  value={user?.username || ''}
                  disabled
                  className="bg-neutral-800/50"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Rol
                </label>
                <Input
                  value={user?.rol || ''}
                  disabled
                  className="bg-neutral-800/50 capitalize"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Nombre Completo
              </label>
              <Input
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>

            <Button variant="secondary" onClick={handleUpdateProfile} loading={saving}>
              Actualizar Perfil
            </Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SecurityIcon className="w-5 h-5 text-amber-400" />
              <CardTitle>Cambiar Contraseña</CardTitle>
            </div>
          </CardHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Contraseña Actual
              </label>
              <Input
                type="password"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                placeholder="Tu contraseña actual"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Nueva Contraseña
                </label>
                <Input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  placeholder="Nueva contraseña"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Confirmar Contraseña
                </label>
                <Input
                  type="password"
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  placeholder="Confirmar contraseña"
                />
              </div>
            </div>

            <Button 
              variant="secondary" 
              onClick={handleChangePassword} 
              loading={saving}
              disabled={!passwordActual || !passwordNueva || !passwordConfirmar}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </Card>

        {/* Network Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <NetworkIcon className="w-5 h-5 text-blue-400" />
              <CardTitle>Configuración de Red</CardTitle>
            </div>
          </CardHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Red a escanear (CIDR)
              </label>
              <Input
                value={localConfig.red_escaneo}
                onChange={(e) => setLocalConfig({ ...localConfig, red_escaneo: e.target.value })}
                placeholder="192.168.1.0/24"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Formato: IP/máscara. Ejemplo: 192.168.1.0/24 para escanear 254 hosts
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Timeout (ms)
                </label>
                <Input
                  type="number"
                  value={localConfig.timeout_ms}
                  onChange={(e) => setLocalConfig({ ...localConfig, timeout_ms: parseInt(e.target.value) || 2000 })}
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Concurrencia
                </label>
                <Input
                  type="number"
                  value={localConfig.concurrencia}
                  onChange={(e) => setLocalConfig({ ...localConfig, concurrencia: parseInt(e.target.value) || 50 })}
                  placeholder="50"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Scan Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-purple-400" />
              <CardTitle>Programación de Escaneos</CardTitle>
            </div>
          </CardHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
              <div>
                <p className="text-sm text-neutral-200">Escaneo automático</p>
                <p className="text-xs text-neutral-500">Ejecutar escaneos periódicamente</p>
              </div>
              <ToggleSwitch
                enabled={localConfig.escaneo_automatico}
                onChange={(value) => setLocalConfig({ ...localConfig, escaneo_automatico: value })}
              />
            </div>

            {localConfig.escaneo_automatico && (
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Intervalo de escaneo (minutos)
                </label>
                <Input
                  type="number"
                  value={localConfig.intervalo_escaneo}
                  onChange={(e) => setLocalConfig({ ...localConfig, intervalo_escaneo: parseInt(e.target.value) || 30 })}
                  placeholder="30"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
              <div>
                <p className="text-sm text-neutral-200">Alertas de seguridad</p>
                <p className="text-xs text-neutral-500">Mostrar alertas para puertos inseguros</p>
              </div>
              <ToggleSwitch
                enabled={localConfig.alertas_activas}
                onChange={(value) => setLocalConfig({ ...localConfig, alertas_activas: value })}
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={handleSaveConfig} loading={saving}>
            Guardar Configuración
          </Button>
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <MainLayout>
      <SettingsContent />
    </MainLayout>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
        ${enabled ? 'bg-blue-600' : 'bg-neutral-700'}
      `}
    >
      <span
        className={`
          inline-block w-4 h-4 bg-white rounded-full transition-transform duration-200 transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
