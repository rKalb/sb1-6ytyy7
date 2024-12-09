import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export type SortDirection = 'asc' | 'desc';

interface TableHeaderProps {
  label: string;
  sortKey: string;
  sortConfig: {
    key: string;
    direction: SortDirection;
  } | null;
  onSort: (key: string) => void;
}

export function TableHeader({ label, sortKey, sortConfig, onSort }: TableHeaderProps) {
  const isActive = sortConfig?.key === sortKey;
  const direction = sortConfig?.direction;

  return (
    <th 
      onClick={() => onSort(sortKey)}
      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="inline-flex flex-shrink-0">
          {isActive ? (
            direction === 'asc' ? (
              <ChevronUpIcon className="h-4 w-4 text-indigo-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-indigo-500" />
            )
          ) : (
            <div className="h-4 w-4 opacity-0 group-hover:opacity-50">
              <ChevronUpIcon className="h-4 w-4" />
            </div>
          )}
        </span>
      </div>
    </th>
  );
}