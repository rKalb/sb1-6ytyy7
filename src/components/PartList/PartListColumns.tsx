import React from 'react';

export interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface PartListColumnsProps {
  columns: Column[];
  onColumnChange: (columns: Column[]) => void;
}

export function PartListColumns({ columns, onColumnChange }: PartListColumnsProps) {
  const toggleColumn = (key: string) => {
    const newColumns = columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onColumnChange(newColumns);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Show columns:</span>
        {columns.map((column) => (
          <label key={column.key} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={column.visible}
              onChange={() => toggleColumn(column.key)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">{column.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}