import React from 'react';

interface ExistingPartFieldProps {
  isExistingPart: boolean;
  partNumber: string;
  onExistingPartChange: (isExisting: boolean) => void;
  onPartNumberChange: (partNumber: string) => void;
  disabled?: boolean;
}

export function ExistingPartField({
  isExistingPart,
  partNumber,
  onExistingPartChange,
  onPartNumberChange,
  disabled = false
}: ExistingPartFieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="existingPart"
          checked={isExistingPart}
          onChange={(e) => onExistingPartChange(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          disabled={disabled}
        />
        <label htmlFor="existingPart" className="ml-2 block text-sm text-gray-900">
          Existing Fellten Part
        </label>
      </div>

      {isExistingPart && (
        <div>
          <label htmlFor="felltenPartNumber" className="block text-sm font-medium text-gray-700">
            Fellten Part Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="felltenPartNumber"
            value={partNumber}
            onChange={(e) => onPartNumberChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter existing Fellten part number"
            required={isExistingPart}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}