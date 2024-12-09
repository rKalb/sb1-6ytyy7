import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from '../../stores/useAdminStore';

interface AdvancedSearchFilters {
  category: string;
  subcategory: string;
  status: string;
  metadata: Record<string, string>;
}

interface AdvancedSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedSearchFilters;
  onApplyFilters: (filters: AdvancedSearchFilters) => void;
}

export function AdvancedSearchDialog({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}: AdvancedSearchDialogProps) {
  const { categories, metadata } = useAdminStore();
  const [localFilters, setLocalFilters] = React.useState(filters);

  const selectedCategory = categories.find(c => c.id === localFilters.category);
  const metadataFields = localFilters.category && localFilters.subcategory
    ? metadata[localFilters.category]?.[localFilters.subcategory] || []
    : [];

  const handleChange = (key: keyof AdvancedSearchFilters, value: string) => {
    if (key === 'category') {
      setLocalFilters({
        ...localFilters,
        category: value,
        subcategory: '',
        metadata: {}
      });
    } else if (key === 'subcategory') {
      setLocalFilters({
        ...localFilters,
        subcategory: value,
        metadata: {}
      });
    } else {
      setLocalFilters({
        ...localFilters,
        [key]: value
      });
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
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      subcategory: '',
      status: '',
      metadata: {}
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Advanced Search
                    </Dialog.Title>
                    <div className="mt-4 space-y-4">
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
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-3 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-3"
                    onClick={handleApply}
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-2 sm:mt-0"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}