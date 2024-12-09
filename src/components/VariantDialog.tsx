import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VariantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; comment: string; userInitials: string }) => void;
}

export function VariantDialog({ isOpen, onClose, onSubmit }: VariantDialogProps) {
  const [name, setName] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [userInitials, setUserInitials] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      name: name.trim(),
      comment: comment.trim(),
      userInitials: userInitials.trim().toUpperCase()
    });
    setName('');
    setComment('');
    setUserInitials('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              Create New Variant
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <div>
              <label htmlFor="variantName" className="block text-sm font-medium text-gray-700">
                Variant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="variantName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                placeholder="Enter variant name"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="userInitials" className="block text-sm font-medium text-gray-700">
                Your Initials <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userInitials"
                value={userInitials}
                onChange={(e) => setUserInitials(e.target.value.slice(0, 3))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                maxLength={3}
                placeholder="e.g., JD"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={4}
                required
                placeholder="Describe the reason for creating this variant..."
              />
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                disabled={!name.trim() || !comment.trim() || !userInitials.trim()}
              >
                Create Variant
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}