import React from 'react';
import { Menu } from '@headlessui/react';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import { Column } from '../../hooks/useTableColumns';

interface ColumnManagerProps {
  columns: Column[];
  onToggle: (key: string) => void;
  onReset: () => void;
}

export function ColumnManager({ columns, onToggle, onReset }: ColumnManagerProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <ViewColumnsIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                  onClick={() => onToggle(column.key)}
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
          <div className="border-t border-gray-100">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                  onClick={onReset}
                >
                  Reset to Default
                </button>
              )}
            </Menu.Item>
          </div>
        </div>
      </Menu.Items>
    </Menu>
  );
}