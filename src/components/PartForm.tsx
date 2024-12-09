import React from 'react';
import { CategorySelector } from './CategorySelector';
import { MetadataForm } from './MetadataForm';
import { useAdminStore } from '../stores/useAdminStore';
import { toUpperCase } from '../utils/formatters';
import { ManufacturerCombobox } from './ManufacturerCombobox';

interface PartFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<{
    manufacturerId: string;
    manufacturerPartNumber: string;
    description: string;
    category: string;
    metadata: Record<string, string>;
  }>;
  onCancel?: () => void;
}

export function PartForm({ onSubmit, initialData, onCancel }: PartFormProps) {
  const { metadata } = useAdminStore();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const [formState, setFormState] = React.useState(() => ({
    manufacturerId: initialData?.manufacturerId || '',
    manufacturerPartNumber: initialData?.manufacturerPartNumber || '',
    category: initialData?.category?.substring(0, 2) || '',
    subcategory: initialData?.category?.substring(2, 4) || '',
    description: initialData?.description || '',
    metadata: initialData?.metadata || {},
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCategory = `${formState.category}${formState.subcategory}`;
    
    onSubmit({
      manufacturerId: formState.manufacturerId || undefined,
      manufacturerPartNumber: formState.manufacturerPartNumber || undefined,
      category: fullCategory,
      description: toUpperCase(formState.description),
      metadata: formState.metadata,
    });

    if (!initialData) {
      setFormState({
        manufacturerId: '',
        manufacturerPartNumber: '',
        category: '',
        subcategory: '',
        description: '',
        metadata: {},
      });
      formRef.current?.reset();
    }
  };

  const metadataFields = formState.category && formState.subcategory
    ? metadata[formState.category]?.[formState.subcategory] || []
    : [];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
            Manufacturer
          </label>
          <ManufacturerCombobox
            value={formState.manufacturerId}
            onChange={(manufacturerId) => setFormState(prev => ({ ...prev, manufacturerId }))}
            required
          />
        </div>

        <div>
          <label htmlFor="manufacturerPartNumber" className="block text-sm font-medium text-gray-700">
            Manufacturer Part Number
          </label>
          <input
            type="text"
            id="manufacturerPartNumber"
            value={formState.manufacturerPartNumber}
            onChange={(e) => setFormState(prev => ({ ...prev, manufacturerPartNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <CategorySelector 
        onSelect={(categoryId, subcategoryId) => setFormState(prev => ({
          ...prev,
          category: categoryId,
          subcategory: subcategoryId,
          metadata: {}, // Reset metadata when category changes
        }))}
        initialCategory={formState.category}
        initialSubcategory={formState.subcategory}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formState.description}
          onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          required
        />
      </div>

      {metadataFields.length > 0 && (
        <MetadataForm
          fields={metadataFields}
          values={formState.metadata}
          onChange={(metadata) => setFormState(prev => ({ ...prev, metadata }))}
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
        >
          {initialData ? 'Update Part' : 'Create Part'}
        </button>
      </div>
    </form>
  );
}