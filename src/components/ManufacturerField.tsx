import React from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ManufacturerCombobox } from './ManufacturerCombobox';
import { ManufacturerDialog } from './ManufacturerDialog';

interface ManufacturerFieldProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function ManufacturerField({ value, onChange, required = false }: ManufacturerFieldProps) {
  const [showDialog, setShowDialog] = React.useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
          Manufacturer {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleAddClick}
          className="inline-flex items-center px-2 py-1 text-sm text-indigo-600 hover:text-indigo-900"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add New
        </button>
      </div>
      <div className="mt-1">
        <ManufacturerCombobox
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>

      <ManufacturerDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSelect={onChange}
      />
    </div>
  );
}