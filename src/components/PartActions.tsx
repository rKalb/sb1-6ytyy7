import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartStore } from '../stores/usePartStore';
import { Part } from '../types/part';
import { debug } from '../utils/debug';
import { ChangeLogDialog } from './ChangeLogDialog';
import { VariantDialog } from './VariantDialog';
import { useChangeLogStore } from '../stores/useChangeLogStore';

interface PartActionsProps {
  part: Part;
}

export function PartActions({ part }: PartActionsProps) {
  const navigate = useNavigate();
  const { updatePartStatus, createRevision, createVariant, deletePart } = usePartStore();
  const { addEntry } = useChangeLogStore();
  const [showChangeLogDialog, setShowChangeLogDialog] = React.useState(false);
  const [showVariantDialog, setShowVariantDialog] = React.useState(false);
  const [changeLogType, setChangeLogType] = React.useState<'status' | 'revision' | 'variant' | 'note' | null>(null);
  const [statusChange, setStatusChange] = React.useState<{ oldValue: string; newValue: string } | null>(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
      try {
        debug.log('Deleting part:', part.partNumber);
        await deletePart(part.partNumber);
        debug.log('Part deleted successfully');
        navigate('/parts');
      } catch (error) {
        debug.error('Error deleting part:', error);
        alert('Failed to delete part. Please try again.');
      }
    }
  };

  const handleRevisionCreate = () => {
    setChangeLogType('revision');
    setShowChangeLogDialog(true);
  };

  const handleVariantCreate = () => {
    setShowVariantDialog(true);
  };

  const handleStatusChange = (newStatus: 'active' | 'obsolete' | 'pending') => {
    setStatusChange({ oldValue: part.status, newValue: newStatus });
    setChangeLogType('status');
    setShowChangeLogDialog(true);
  };

  const handleAddNote = () => {
    setChangeLogType('note');
    setShowChangeLogDialog(true);
  };

  const handleChangeLogSubmit = async ({ comment, userInitials }: { comment: string; userInitials: string }) => {
    try {
      debug.log('Processing change with comment:', comment);
      
      if (changeLogType === 'status' && statusChange) {
        await updatePartStatus(part.partNumber, statusChange.newValue as any, comment, userInitials);
      } else if (changeLogType === 'revision') {
        await createRevision(part.partNumber, comment, userInitials);
      } else if (changeLogType === 'note') {
        const entry = {
          id: crypto.randomUUID(),
          partNumber: part.partNumber,
          type: 'note' as const,
          description: 'Note added',
          comment,
          userInitials,
          timestamp: new Date().toISOString()
        };
        await addEntry(entry);
      }
    } catch (error) {
      debug.error('Error processing change:', error);
      alert('Failed to process change. Please try again.');
    }

    setShowChangeLogDialog(false);
    setChangeLogType(null);
    setStatusChange(null);
  };

  const handleVariantSubmit = async ({ name, comment, userInitials }: { name: string; comment: string; userInitials: string }) => {
    try {
      debug.log('Creating variant:', { name, comment });
      await createVariant(part.partNumber, name, comment, userInitials);
    } catch (error) {
      debug.error('Error creating variant:', error);
      alert('Failed to create variant. Please try again.');
    }

    setShowVariantDialog(false);
  };

  return (
    <>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-start">
        <div className="sm:flex-none">
          <select
            value={part.status}
            onChange={(e) => handleStatusChange(e.target.value as 'active' | 'obsolete' | 'pending')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="obsolete">Obsolete</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          onClick={handleRevisionCreate}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Rev Up
        </button>
        <button
          onClick={handleVariantCreate}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          New Variant
        </button>
        <button
          onClick={handleAddNote}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add Note
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Part
        </button>
      </div>

      {showChangeLogDialog && changeLogType && (
        <ChangeLogDialog
          isOpen={showChangeLogDialog}
          onClose={() => {
            setShowChangeLogDialog(false);
            setChangeLogType(null);
            setStatusChange(null);
          }}
          onSubmit={handleChangeLogSubmit}
          type={changeLogType}
          oldValue={statusChange?.oldValue || part.revision}
          newValue={statusChange?.newValue}
        />
      )}

      {showVariantDialog && (
        <VariantDialog
          isOpen={showVariantDialog}
          onClose={() => setShowVariantDialog(false)}
          onSubmit={handleVariantSubmit}
        />
      )}
    </>
  );
}