import React from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DuplicateMatch } from '../utils/duplicateDetection';
import { Link } from 'react-router-dom';

interface DuplicateWarningProps {
  duplicates: DuplicateMatch[];
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function DuplicateWarning({ duplicates, isOpen, onClose, onContinue }: DuplicateWarningProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Potential Duplicates Found
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-gray-500 mb-4">
              We found the following potential duplicate parts in the system:
            </p>
            
            <div className="space-y-4">
              {duplicates.map((duplicate) => (
                <div
                  key={duplicate.part.id}
                  className="border rounded-lg p-4 bg-yellow-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/parts/${duplicate.part.partNumber}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        target="_blank"
                      >
                        {duplicate.part.partNumber}
                      </Link>
                      <p className="text-sm text-gray-900 mt-1">
                        {duplicate.part.name || duplicate.part.description}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {duplicate.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onContinue}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Create Anyway
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}