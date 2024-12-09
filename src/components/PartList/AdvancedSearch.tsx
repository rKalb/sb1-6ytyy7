import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from '../../stores/useAdminStore';

interface AdvancedSearchFilters {
  partNumber: string;
  description: string;
  category: string;
  subcategory: string;
  status: string;
  metadata: Record<string, string>;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedSearchFilters;
  onFilterChange: (filters: AdvancedSearchFilters) => void;
}

export function AdvancedSearch({ isOpen, onClose, filters, onFilterChange }: AdvancedSearchProps) {
  const { categories, metadata } = useAdminStore();
  const [localFilters, setLocalFilters] = React.useState(filters);

  const selectedCategory = categories.find(c => c.id === localFilters.category);
  const metadataFields = localFilters.category && localFilters.subcategory
    ? metadata[localFilters.category]?.[localFilters.subcategory] || []
    : [];

  const handleChange = (key: keyof AdvancedSearchFilters, value: string) => {
    if (key === 'category') {
      setLocalFilters(prev => ({
        ...prev,
        [key]: value,
        subcategory: '',
        metadata: {}
      }));
    } else if (key === 'subcategory') {
      setLocalFilters(prev => ({
        ...prev,
        [key]: value,
        metadata: {}
      }));
    } else {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleMetadataChange = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      partNumber: '',
      description: '',
      category: '',
      subcategory: '',
      status: '',
      metadata: {}
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Advanced Search
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="part-number" className="block text-sm font-medium text-gray-700">
                              Part Number
                            </label>
                            <input
                              type="text"
                              id="part-number"
                              value={localFilters.partNumber}
                              onChange={(e) => handleChange('partNumber', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <input
                              type="text"
                              id="description"
                              value={localFilters.description}
                              onChange={(e) => handleChange('description', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <select
                              id="category"
                              value={localFilters.category}
                              onChange={(e) => handleChange('category', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="">All Categories</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedCategory?.subcategories && (
                            <div>
                              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                                Subcategory
                              </label>
                              <select
                                id="subcategory"
                                value={localFilters.subcategory}
                                onChange={(e) => handleChange('subcategory', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">All Subcategories</option>
                                {selectedCategory.subcategories.map((sub) => (
                                  <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              id="status"
                              value={localFilters.status}
                              onChange={(e) => handleChange('status', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="">All Statuses</option>
                              <option value="active">Active</option>
                              <option value="obsolete">Obsolete</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>

                          {metadataFields.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-900">Specifications</h4>
                              {metadataFields.map((field) => (
                                <div key={field.key}>
                                  <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                                    {field.label}
                                  </label>
                                  {field.type === 'select' ? (
                                    <select
                                      id={field.key}
                                      value={localFilters.metadata[field.key] || ''}
                                      onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                      <option value="">Any</option>
                                      {field.options?.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type={field.type}
                                      id={field.key}
                                      value={localFilters.metadata[field.key] || ''}
                                      onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      placeholder={`Search ${field.label.toLowerCase()}`}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="mr-auto rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleApply}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}