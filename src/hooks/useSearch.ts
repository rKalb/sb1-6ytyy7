import { useMemo } from 'react';
import { Part } from '../types/part';
import { parseSearchQuery, matchesSearchTokens } from '../utils/searchParser';

interface SearchFilters {
  search: string;
  category: string;
  status: string;
  metadata: Record<string, string>;
}

export function useSearch(parts: Part[], filters: SearchFilters) {
  return useMemo(() => {
    let filteredParts = [...parts];

    // Apply text search
    if (filters.search) {
      const searchGroup = parseSearchQuery(filters.search);
      filteredParts = filteredParts.filter(part => matchesSearchTokens(part, searchGroup));
    }

    // Apply category filter
    if (filters.category) {
      filteredParts = filteredParts.filter(part => 
        part.category.startsWith(filters.category)
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredParts = filteredParts.filter(part => 
        part.status === filters.status
      );
    }

    // Apply metadata filters
    if (Object.keys(filters.metadata).length > 0) {
      filteredParts = filteredParts.filter(part => {
        return Object.entries(filters.metadata).every(([key, value]) => {
          const partValue = part.metadata[key];
          return partValue && partValue.toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return filteredParts;
  }, [parts, filters]);
}