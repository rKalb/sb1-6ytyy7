import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { debug } from '../utils/debug';

interface ChangeLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { comment: string; userInitials: string }) => void;
  type: 'status' | 'revision' | 'variant' | 'note';
  oldValue?: string;
  newValue?: string;
}

export function ChangeLogDialog({ 
  isOpen, 
  onClose, 
  onSubmit,
  type,
  oldValue,
  newValue
}: ChangeLogDialogProps) {
  const [comment, setComment] = React.useState('');
  const [userInitials, setUserInitials] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debug.log('Submitting changelog:', { type, oldValue, newValue, comment, userInitials });
    
    onSubmit({ 
      comment: comment.trim(),
      userInitials: userInitials.trim().toUpperCase()
    });
    setComment('');
    setUserInitials('');
  };

  const getDescription = (type: string, oldValue?: string, newValue?: string) => {
    switch (type) {
      case 'status':
        return `Status change from "${oldValue}" to "${newValue}"`;
      case 'revision':
        return `Creating new revision (${newValue})`;
      case 'variant':
        return 'Creating new variant';
      case 'note':
        return 'Adding note';
      default:
        return 'Part modification';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              Add Change Log Entry
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
              <label className="block text-sm font-medium text-gray-700">
                Change Type
              </label>
              <p className="mt-1 text-sm text-gray-500">
                {getDescription(type, oldValue, newValue)}
              </p>
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
                placeholder="Describe the reason for this change..."
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
                disabled={!comment.trim() || !userInitials.trim()}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}