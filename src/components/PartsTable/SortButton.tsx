import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export type SortDirection = 'asc' | 'desc';

interface SortButtonProps {
  label: string;
  active: boolean;
  direction?: SortDirection;
  onClick: () => void;
}

export function SortButton({ label, active, direction, onClick }: SortButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center space-x-1 text-left text-sm font-medium text-gray-900"
    >
      <span>{label}</span>
      <span className="flex-none rounded text-gray-400">
        {active ? (
          direction === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )
        ) : (
          <ChevronUpIcon className="invisible h-4 w-4 group-hover:visible" />
        )}
      </span>
    </button>
  );
}