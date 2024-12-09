import React from 'react';
import { useAdminStore } from '../../stores/useAdminStore';

interface PartListFiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

export function PartListFilters({ onFilterChange }: PartListFiltersProps) {
  const { categories } = useAdminStore();
  const [filters, setFilters] = React.useState({
    search: '',
    category: '',
    status: '',
    metadata: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search part number, description..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="obsolete">Obsolete</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label htmlFor="metadata" className="block text-sm font-medium text-gray-700">
            Metadata Search
          </label>
          <input
            type="text"
            id="metadata"
            value={filters.metadata}
            onChange={(e) => handleFilterChange('metadata', e.target.value)}
            placeholder="Search in specifications..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}