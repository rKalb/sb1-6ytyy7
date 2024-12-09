import React from 'react';
import { CategorySelector } from '../CategorySelector';
import { MetadataForm } from '../MetadataForm';
import { useAdminStore } from '../../stores/useAdminStore';
import { toUpperCase } from '../../utils/formatters';
import { ManufacturerField } from '../ManufacturerField';
import { ExistingPartField } from './ExistingPartField';
import { debug } from '../../utils/debug';

interface SimpleFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<{
    name: string;
    manufacturerId: string;
    manufacturerPartNumber: string;
    felltenPartNumber: string;
    description: string;
    category: string;
    metadata: Record<string, string>;
    notes?: string;
  }>;
  onCancel?: () => void;
}

export function SimpleForm({ onSubmit, initialData, onCancel }: SimpleFormProps) {
  const { metadata } = useAdminStore();
  const formRef = React.useRef<HTMLFormElement>(null);
  const isEditing = !!initialData;
  
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    manufacturerId: initialData?.manufacturerId || '',
    manufacturerPartNumber: initialData?.manufacturerPartNumber || '',
    category: initialData?.category?.substring(0, 2) || '',
    subcategory: initialData?.category?.substring(2, 4) || '',
    description: initialData?.description || '',
    metadata: initialData?.metadata || {},
    isExistingPart: !!initialData?.felltenPartNumber,
    felltenPartNumber: initialData?.felltenPartNumber || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debug.log('Form submission:', formData);

    onSubmit({
      name: toUpperCase(formData.name),
      manufacturerId: formData.manufacturerId,
      manufacturerPartNumber: formData.manufacturerPartNumber,
      felltenPartNumber: formData.isExistingPart ? formData.felltenPartNumber : undefined,
      description: formData.description,
      category: `${formData.category}${formData.subcategory}`,
      metadata: formData.metadata,
      notes: formData.notes
    });
  };

  const metadataFields = formData.category && formData.subcategory
    ? metadata[formData.category]?.[formData.subcategory] || []
    : [];

  const isCategorySelected = formData.category && formData.subcategory;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              name: e.target.value.slice(0, 20)
            }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            maxLength={20}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.name.length}/20 characters
          </p>
        </div>
      </div>

      <ExistingPartField
        isExistingPart={formData.isExistingPart}
        partNumber={formData.felltenPartNumber}
        onExistingPartChange={(isExisting) => setFormData(prev => ({
          ...prev,
          isExistingPart: isExisting,
          felltenPartNumber: isExisting ? prev.felltenPartNumber : ''
        }))}
        onPartNumberChange={(partNumber) => setFormData(prev => ({
          ...prev,
          felltenPartNumber: partNumber
        }))}
        disabled={isEditing} // Disable when editing existing part
      />

      <ManufacturerField
        value={formData.manufacturerId}
        onChange={(id) => setFormData(prev => ({ ...prev, manufacturerId: id }))}
        required={true}
      />

      <div>
        <label htmlFor="manufacturerPartNumber" className="block text-sm font-medium text-gray-700">
          Manufacturer Part Number
        </label>
        <input
          type="text"
          id="manufacturerPartNumber"
          value={formData.manufacturerPartNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, manufacturerPartNumber: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <CategorySelector 
          onSelect={(categoryId, subcategoryId) => setFormData(prev => ({
            ...prev,
            category: categoryId,
            subcategory: subcategoryId,
            metadata: {},
          }))}
          initialCategory={formData.category}
          initialSubcategory={formData.subcategory}
          required={true}
          showLabels={false}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
          placeholder="Add any additional notes about this part..."
        />
      </div>

      {metadataFields.length > 0 && (
        <MetadataForm
          fields={metadataFields}
          values={formData.metadata}
          onChange={(metadata) => setFormData(prev => ({ ...prev, metadata }))}
        />
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={!isCategorySelected || !formData.manufacturerId}
        >
          {initialData ? 'Update Part' : 'Create Part'}
        </button>
      </div>
    </form>
  );
}