import React from 'react';
import { CategorySelector } from '../CategorySelector';
import { MetadataForm } from '../MetadataForm';
import { useAdminStore } from '../../stores/useAdminStore';
import { toUpperCase } from '../../utils/formatters';
import { ManufacturerField } from './ManufacturerField';

interface PartFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<{
    name: string;
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
    name: initialData?.name || '',
    category: initialData?.category?.substring(0, 2) || '',
    subcategory: initialData?.category?.substring(2, 4) || '',
    manufacturerId: initialData?.manufacturerId || '',
    manufacturerPartNumber: initialData?.manufacturerPartNumber || '',
    description: initialData?.description || '',
    metadata: initialData?.metadata || {},
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCategory = `${formState.category}${formState.subcategory}`;
    
    onSubmit({
      name: toUpperCase(formState.name),
      manufacturerId: formState.manufacturerId || undefined,
      manufacturerPartNumber: formState.manufacturerPartNumber || undefined,
      description: formState.description,
      category: fullCategory,
      metadata: formState.metadata,
    });

    if (!initialData) {
      setFormState({
        name: '',
        manufacturerId: '',
        manufacturerPartNumber: '',
        description: '',
        category: '',
        subcategory: '',
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
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value.slice(0, 20) }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            maxLength={20}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formState.name.length}/20 characters
          </p>
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

      {formState.category && formState.subcategory && (
        <>
          <ManufacturerField
            value={formState.manufacturerId}
            onChange={(manufacturerId) => setFormState(prev => ({ ...prev, manufacturerId }))}
          />

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
        </>
      )}

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