import React from 'react';
import { SortButton, SortDirection } from './SortButton';

interface TableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: SortDirection } | null;
  onSort: (key: string) => void;
}

export function TableHeader({ label, sortKey, currentSort, onSort }: TableHeaderProps) {
  const isActive = currentSort?.key === sortKey;

  return (
    <th scope="col" className="px-3 py-3.5 text-left">
      <SortButton
        label={label}
        active={isActive}
        direction={isActive ? currentSort.direction : undefined}
        onClick={() => onSort(sortKey)}
      />
    </th>
  );
}