import React from 'react';
import { PartStatusBadge } from './PartStatusBadge';
import { formatDate } from '../utils/formatters';
import { getCategoryName } from '../utils/partNumberGenerator';
import { useManufacturerStore } from '../stores/useManufacturerStore';
import { ChangeLogList } from './ChangeLogList';
import { useChangeLogStore } from '../stores/useChangeLogStore';

interface PartDetailsProps {
  part: {
    partNumber: string;
    name?: string;
    manufacturerId?: string;
    manufacturerPartNumber?: string;
    felltenPartNumber?: string;
    description: string;
    category: string;
    status: 'active' | 'obsolete' | 'pending';
    revision: string;
    variantName?: string;
    createdAt: string;
    updatedAt: string;
    metadata: Record<string, string>;
    notes?: string;
  };
}

export function PartDetails({ part }: PartDetailsProps) {
  const { getManufacturer } = useManufacturerStore();
  const { entries, loadEntries } = useChangeLogStore();
  const manufacturer = part.manufacturerId ? getManufacturer(part.manufacturerId) : undefined;

  React.useEffect(() => {
    loadEntries(part.partNumber);
  }, [part.partNumber, loadEntries]);

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Part Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{part.partNumber}</dd>
          </div>

          {part.felltenPartNumber && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Fellten Part Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{part.felltenPartNumber}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{part.name || 'No name provided'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{part.description}</dd>
          </div>

          {manufacturer && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {manufacturer.name} ({manufacturer.code})
              </dd>
            </div>
          )}

          {part.manufacturerPartNumber && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Manufacturer Part Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{part.manufacturerPartNumber}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {getCategoryName(part.category.substring(0, 2), part.category.substring(2, 4))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <PartStatusBadge status={part.status} />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Revision</dt>
            <dd className="mt-1 text-sm text-gray-900">{part.revision}</dd>
          </div>

          {part.variantName && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Variant Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{part.variantName}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(part.createdAt)}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(part.updatedAt)}</dd>
          </div>

          {part.notes && (
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{part.notes}</dd>
            </div>
          )}
        </div>
      </div>

      {Object.entries(part.metadata).length > 0 && (
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(part.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-gray-200 py-2">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Change History</h3>
        <ChangeLogList entries={entries} />
      </div>
    </div>
  );
}