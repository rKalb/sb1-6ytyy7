import React from 'react';
import { MetadataField } from '../types/metadata';

interface MetadataFormProps {
  fields: MetadataField[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export function MetadataForm({ fields, values, onChange }: MetadataFormProps) {
  const handleChange = (field: MetadataField, value: string, unit?: string) => {
    const formattedValue = unit ? `${value} ${unit}` : value;
    onChange({
      ...values,
      [field.label]: formattedValue
    });
  };

  const parseValueAndUnit = (value: string, field: MetadataField) => {
    if (!value || !field.unit) return { value, unit: field.unit };
    const parts = value.split(' ');
    if (parts.length === 2) {
      return { value: parts[0], unit: parts[1] };
    }
    return { value, unit: field.unit };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Required Specifications</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const currentValue = values[field.label] || '';
          const { value, unit } = parseValueAndUnit(currentValue, field);

          return (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                {field.type === 'select' ? (
                  <select
                    id={field.key}
                    value={value}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex w-full">
                    <input
                      type={field.type}
                      id={field.key}
                      value={value}
                      onChange={(e) => handleChange(
                        field,
                        e.target.value,
                        field.unitOptions ? unit : field.unit
                      )}
                      className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required={field.required}
                    />
                    {field.unit && (
                      field.unitOptions ? (
                        <select
                          value={unit || field.unit}
                          onChange={(e) => handleChange(
                            field,
                            value,
                            e.target.value
                          )}
                          className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                        >
                          {field.unitOptions.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                          {field.unit}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}