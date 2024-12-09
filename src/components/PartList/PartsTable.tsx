import React from 'react';
import { Link } from 'react-router-dom';
import { Part } from '../../types/part';
import { PartStatusBadge } from '../PartStatusBadge';
import { formatDate } from '../../utils/formatters';
import { getCategoryName } from '../../utils/partNumberGenerator';
import { PartActions } from '../PartActions';
import { TableHeader } from './TableHeader';

interface PartsTableProps {
  parts: Part[];
  onEdit: (part: Part) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'active' | 'obsolete' | 'pending') => void;
  onRevisionChange: (id: string) => void;
  onVariantCreate: (id: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}

export function PartsTable({
  parts,
  onEdit,
  onDelete,
  onStatusChange,
  onRevisionChange,
  onVariantCreate,
  sortConfig,
  onSort
}: PartsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader
              label="Part Number"
              sortKey="partNumber"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableHeader
              label="Description"
              sortKey="description"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableHeader
              label="Category"
              sortKey="category"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableHeader
              label="Status"
              sortKey="status"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableHeader
              label="Revision"
              sortKey="revision"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specifications
            </th>
            <TableHeader
              label="Last Updated"
              sortKey="updatedAt"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parts.map((part) => (
            <tr key={part.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link
                  to={`/parts/${encodeURIComponent(part.partNumber)}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {part.partNumber}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {part.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getCategoryName(part.category.substring(0, 2), part.category.substring(2, 4))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PartStatusBadge status={part.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {part.revision}
                <div className="text-xs text-gray-400">
                  Created: {formatDate(part.createdAt)}
                  <br />
                  Updated: {formatDate(part.updatedAt)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-500">
                  {Object.entries(part.metadata).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="font-medium">{key}:</div>
                      <div>{value}</div>
                    </React.Fragment>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(part.updatedAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                <PartActions
                  part={part}
                  onStatusChange={(status) => onStatusChange(part.id, status)}
                  onRevisionChange={() => onRevisionChange(part.id)}
                  onVariantCreate={() => onVariantCreate(part.id)}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => onEdit(part)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(part.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}