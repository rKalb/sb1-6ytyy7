import React from 'react';
import { PencilIcon } from '@heroicons/react/20/solid';
import { TitleDialog } from './TitleDialog';

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleField({ value, onChange }: TitleFieldProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-2 py-1 text-sm text-indigo-600 hover:text-indigo-900"
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          Edit
        </button>
      </div>
      <div className="mt-1 p-2 bg-gray-50 rounded-md">
        {value ? (
          <p className="text-sm text-gray-700">
            {value}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No title provided
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {value.length}/20 characters
        </p>
      </div>

      <TitleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}