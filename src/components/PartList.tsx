import React from 'react';
import { Part } from '../types/part';
import { PartStatusBadge } from './PartStatusBadge';
import { PartMetadata } from './PartMetadata';
import { formatDate } from '../utils/formatters';
import { getCategoryName } from '../utils/partNumberGenerator';
import { PartActions } from './PartActions';

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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Part Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specifications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parts.map((part) => (
            <tr key={part.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {part.partNumber}
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
              <td className="px-6 py-4">
                <PartMetadata metadata={part.metadata} />
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