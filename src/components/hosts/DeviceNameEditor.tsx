'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@/components/common';
import { CheckIcon, XIcon } from '@/components/icons';
import api from '@/services/api';

interface DeviceNameEditorProps {
  equipoId: number;
  currentName: string | null;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function DeviceNameEditor({ equipoId, currentName, onSave, onCancel }: DeviceNameEditorProps) {
  const [name, setName] = useState(currentName || '');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.saveDeviceName(equipoId, { 
        nombre: name.trim(),
        descripcion: description.trim() || undefined
      });
      onSave(name.trim());
    } catch (err) {
      setError('Error al guardar el nombre');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-1">
            Nombre del dispositivo
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: PC de Oficina, Router Principal..."
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1">
            Descripción (opcional)
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Notas adicionales..."
            className="text-sm"
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={saving}
            icon={<CheckIcon className="w-3 h-3" />}
          >
            Guardar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            icon={<XIcon className="w-3 h-3" />}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Botón inline para editar nombre
interface EditNameButtonProps {
  equipoId: number;
  currentName: string | null;
  customName: string | null;
  onNameChange?: (name: string) => void;
}

export function EditNameButton({ equipoId, currentName, customName, onNameChange }: EditNameButtonProps) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(customName);

  if (editing) {
    return (
      <DeviceNameEditor
        equipoId={equipoId}
        currentName={displayName || currentName}
        onSave={(name) => {
          setDisplayName(name);
          setEditing(false);
          onNameChange?.(name);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
    >
      {displayName || customName ? 'Editar nombre' : 'Asignar nombre'}
    </button>
  );
}

export default DeviceNameEditor;

