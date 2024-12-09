import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useManufacturerStore } from '../stores/useManufacturerStore';
import { debug } from '../utils/debug';
import { PLMError } from '../services/error';

interface ManufacturerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (manufacturerId: string) => void;
}

export function ManufacturerDialog({ isOpen, onClose, onSelect }: ManufacturerDialogProps) {
  const { addManufacturer } = useManufacturerStore();
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [duplicates, setDuplicates] = React.useState<any[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setDuplicates([]);

    if (!name.trim()) {
      setError('Manufacturer name is required');
      return;
    }

    try {
      const manufacturer = await addManufacturer(name);
      onSelect(manufacturer.id);
      setName('');
      onClose();
    } catch (error) {
      debug.error('Error adding manufacturer:', error);
      
      if (error instanceof PLMError && error.code === 'DUPLICATE_ERROR') {
        setDuplicates(error.originalError.duplicates);
        setShowDuplicateWarning(true);
      } else {
        setError('Failed to add manufacturer. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    setDuplicates([]);
    setShowDuplicateWarning(false);
    onClose();
  };

  if (showDuplicateWarning) {
    return (
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                <Dialog.Title className="text-lg font-medium">
                  Similar Manufacturer Found
                </Dialog.Title>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4">
                Similar manufacturers already exist in the system:
              </p>
              
              <div className="space-y-2">
                {duplicates.map((duplicate) => (
                  <div
                    key={duplicate.id}
                    className="border rounded-lg p-3 bg-yellow-50"
                  >
                    <p className="font-medium">{duplicate.name}</p>
                    <p className="text-sm text-gray-500">Code: {duplicate.code}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              Add New Manufacturer
            </Dialog.Title>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <div>
              <label htmlFor="manufacturerName" className="block text-sm font-medium text-gray-700">
                Manufacturer Name
              </label>
              <input
                type="text"
                id="manufacturerName"
                name="manufacturerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                autoComplete="off"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Add Manufacturer
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}