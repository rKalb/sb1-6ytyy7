import React from 'react';
import { Part } from '../../types/part';
import { FilterBar } from './FilterBar';
import { AdvancedSearch } from './AdvancedSearch';
import { PartsTable } from './PartsTable';
import { SortDirection } from './TableHeader';

interface PartListProps {
  parts: Part[];
  onEdit: (part: Part) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'active' | 'obsolete' | 'pending') => void;
  onRevisionChange: (id: string) => void;
  onVariantCreate: (id: string) => void;
}

export function PartList({
  parts,
  onEdit,
  onDelete,
  onStatusChange,
  onRevisionChange,
  onVariantCreate
}: PartListProps) {
  const [filters, setFilters] = React.useState({
    category: '',
    status: ''
  });
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: SortDirection } | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredAndSortedParts = React.useMemo(() => {
    let result = [...parts];

    // Apply filters
    if (filters.category) {
      result = result.filter(part => part.category.startsWith(filters.category));
    }
    if (filters.status) {
      result = result.filter(part => part.status === filters.status);
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (sortConfig.key) {
          case 'partNumber':
            comparison = a.partNumber.localeCompare(b.partNumber);
            break;
          case 'description':
            comparison = a.description.localeCompare(b.description);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'updatedAt':
            comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
            break;
          default:
            comparison = 0;
        }
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [parts, filters, sortConfig]);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <PartsTable
        parts={filteredAndSortedParts}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onRevisionChange={onRevisionChange}
        onVariantCreate={onVariantCreate}
      />
    </div>
  );
}