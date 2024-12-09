import React from 'react';
import { ManufacturerCombobox } from '../ManufacturerCombobox';

interface ManufacturerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ManufacturerField({ value, onChange }: ManufacturerFieldProps) {
  return (
    <div>
      <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
        Manufacturer
      </label>
      <ManufacturerCombobox
        value={value}
        onChange={onChange}
        required={false}
      />
    </div>
  );
}