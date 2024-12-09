import { useMemo } from 'react';
import { Part } from '../types/part';
import { SortDirection } from '../components/PartsTable/SortButton';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSortedParts(parts: Part[], sortConfig: SortConfig | null) {
  return useMemo(() => {
    if (!sortConfig) return parts;

    return [...parts].sort((a, b) => {
      let comparison = 0;
      
      switch (sortConfig.key) {
        case 'partNumber':
          comparison = a.partNumber.localeCompare(b.partNumber);
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
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
        case 'revision':
          comparison = a.revision.localeCompare(b.revision);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [parts, sortConfig]);
}