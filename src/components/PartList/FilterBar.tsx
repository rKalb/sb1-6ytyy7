import React from 'react';
import { useAdminStore } from '../../stores/useAdminStore';

interface FilterBarProps {
  filters: {
    category: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { categories } = useAdminStore();

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-48">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-48">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="obsolete">Obsolete</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
}