import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/20/solid';
import { usePartStore } from '../stores/usePartStore';
import { SearchBar } from '../components/Search/SearchBar';
import { AdvancedSearchDialog } from '../components/Search/AdvancedSearchDialog';
import { useSearch } from '../hooks/useSearch';
import { TableHeader } from '../components/PartsTable/TableHeader';
import { ColumnManager } from '../components/PartsTable/ColumnManager';
import { useSortedParts } from '../hooks/useSortedParts';
import { useTableColumns } from '../hooks/useTableColumns';
import { SortDirection } from '../components/PartsTable/SortButton';
import { PartStatusBadge } from '../components/PartStatusBadge';
import { PartMetadata } from '../components/PartMetadata';
import { formatDate } from '../utils/formatters';
import { getCategoryName } from '../utils/partNumberGenerator';

export function PartsListPage() {
  const { parts } = usePartStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  const [advancedFilters, setAdvancedFilters] = React.useState({
    category: '',
    subcategory: '',
    status: '',
    metadata: {}
  });
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: SortDirection } | null>(null);
  const { columns, visibleColumns, toggleColumn, resetColumns } = useTableColumns();

  const filteredParts = useSearch(parts, {
    search: searchTerm,
    category: advancedFilters.category + advancedFilters.subcategory,
    status: advancedFilters.status,
    metadata: advancedFilters.metadata
  });

  const sortedParts = useSortedParts(filteredParts, sortConfig);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Parts</h1>
              <div className="flex space-x-4">
                <ColumnManager
                  columns={columns}
                  onToggle={toggleColumn}
                  onReset={resetColumns}
                />
                <Link
                  to="/admin/categories"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                  Admin Console
                </Link>
                <Link
                  to="/parts/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Part
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onAdvancedSearch={() => setShowAdvancedSearch(true)}
                parts={parts}
              />
            </div>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          {visibleColumns.map(column => (
                            <TableHeader
                              key={column.key}
                              label={column.label}
                              sortKey={column.key}
                              currentSort={sortConfig}
                              onSort={handleSort}
                            />
                          ))}
                          <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {sortedParts.map((part) => (
                          <tr key={part.partNumber}>
                            {visibleColumns.map(column => (
                              <td key={`${part.partNumber}-${column.key}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {column.key === 'partNumber' ? (
                                  <Link
                                    to={`/parts/${encodeURIComponent(part.partNumber)}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    {part.partNumber}
                                  </Link>
                                ) : column.key === 'name' ? (
                                  part.name || '-'
                                ) : column.key === 'description' ? (
                                  part.description
                                ) : column.key === 'category' ? (
                                  getCategoryName(part.category.substring(0, 2), part.category.substring(2, 4))
                                ) : column.key === 'status' ? (
                                  <PartStatusBadge status={part.status} />
                                ) : column.key === 'revision' ? (
                                  part.revision
                                ) : column.key === 'specifications' ? (
                                  <PartMetadata metadata={part.metadata} />
                                ) : column.key === 'updatedAt' ? (
                                  formatDate(part.updatedAt)
                                ) : null}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AdvancedSearchDialog
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          filters={advancedFilters}
          onApplyFilters={setAdvancedFilters}
        />
      </div>
    </div>
  );
}