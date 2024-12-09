import React from 'react';
import { useAdminStore } from '../stores/useAdminStore';
import { MetadataField } from '../types/metadata';
import { generateFieldKey } from '../utils/formatters';

export function AdminMetadata() {
  const { categories, metadata, setMetadataFields } = useAdminStore();
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState('');
  const [newField, setNewField] = React.useState<MetadataField>({
    key: '',
    label: '',
    type: 'text',
    required: false,
    options: []
  });
  const [newOption, setNewOption] = React.useState('');

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && selectedSubcategory && newField.label) {
      const fieldWithGeneratedKey = {
        ...newField,
        key: generateFieldKey(newField.label)
      };
      
      const currentFields = metadata[selectedCategory]?.[selectedSubcategory] || [];
      setMetadataFields(selectedCategory, selectedSubcategory, [...currentFields, fieldWithGeneratedKey]);
      
      setNewField({
        key: '',
        label: '',
        type: 'text',
        required: false,
        options: []
      });
      setNewOption('');
    }
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption && !newField.options?.includes(newOption)) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), newOption]
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setNewField({
      ...newField,
      options: newField.options?.filter(option => option !== optionToRemove) || []
    });
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const currentFields = selectedCategory && selectedSubcategory
    ? metadata[selectedCategory]?.[selectedSubcategory] || []
    : [];

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Metadata Configuration</h2>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategoryData?.subcategories && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategoryData.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedCategory && selectedSubcategory && (
            <form onSubmit={handleAddField} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fieldLabel" className="block text-sm font-medium text-gray-700">
                    Field Label
                  </label>
                  <input
                    type="text"
                    id="fieldLabel"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700">
                    Field Type
                  </label>
                  <select
                    id="fieldType"
                    value={newField.type}
                    onChange={(e) => setNewField({
                      ...newField,
                      type: e.target.value as 'text' | 'number' | 'select',
                      options: e.target.value === 'select' ? [] : undefined
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fieldRequired"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fieldRequired" className="ml-2 block text-sm text-gray-900">
                    Required Field
                  </label>
                </div>
              </div>

              {newField.type === 'select' && (
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-grow">
                      <label htmlFor="option" className="block text-sm font-medium text-gray-700">
                        Add Option
                      </label>
                      <input
                        type="text"
                        id="option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Option
                    </button>
                  </div>

                  {newField.options && newField.options.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Current Options</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newField.options.map((option) => (
                          <span
                            key={option}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {option}
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(option)}
                              className="ml-1 text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Field
              </button>
            </form>
          )}

          {currentFields.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Current Fields</h3>
              <div className="mt-4 space-y-4">
                {currentFields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({field.key} - {field.type})
                        {field.required && ' *'}
                      </span>
                      {field.type === 'select' && field.options && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-500">
                            Options: {field.options.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const updatedFields = currentFields.filter(f => f.key !== field.key);
                        setMetadataFields(selectedCategory, selectedSubcategory, updatedFields);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}