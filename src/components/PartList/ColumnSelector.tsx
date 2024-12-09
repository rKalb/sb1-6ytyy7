import React from 'react';
import { Menu } from '@headlessui/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnSelectorProps {
  columns: Column[];
  onColumnToggle: (key: string) => void;
}

export function ColumnSelector({ columns, onColumnToggle }: ColumnSelectorProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <AdjustmentsHorizontalIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        Columns
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {columns.map((column) => (
            <Menu.Item key={column.key}>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                  onClick={() => onColumnToggle(column.key)}
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => {}}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {column.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}