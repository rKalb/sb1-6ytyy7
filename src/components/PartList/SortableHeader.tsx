import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: SortDirection };
  onSort: (key: string) => void;
}

export function SortableHeader({ label, sortKey, currentSort, onSort }: SortableHeaderProps) {
  const isActive = currentSort.key === sortKey;

  return (
    <th 
      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="inline-flex flex-shrink-0">
          {isActive ? (
            currentSort.direction === 'asc' ? (
              <ChevronUpIcon className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            )
          ) : (
            <div className="h-4 w-4 opacity-0 group-hover:opacity-50">
              <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
        </span>
      </div>
    </th>
  );
}