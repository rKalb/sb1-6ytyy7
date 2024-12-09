import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleForm } from '../components/PartForm/SimpleForm';
import { usePartStore } from '../stores/usePartStore';
import { DuplicateWarning } from '../components/DuplicateWarning';
import { findPotentialDuplicates } from '../utils/duplicateDetection';
import { PartCreateInput } from '../types/part';

export function NewPartPage() {
  const navigate = useNavigate();
  const { addPart, parts } = usePartStore();
  const [showDuplicateWarning, setShowDuplicateWarning] = React.useState(false);
  const [pendingPart, setPendingPart] = React.useState<PartCreateInput | null>(null);
  const [duplicates, setDuplicates] = React.useState<ReturnType<typeof findPotentialDuplicates>>([]);

  const handleSubmit = (data: PartCreateInput) => {
    const potentialDuplicates = findPotentialDuplicates(data, parts);
    
    if (potentialDuplicates.length > 0) {
      setDuplicates(potentialDuplicates);
      setPendingPart(data);
      setShowDuplicateWarning(true);
    } else {
      createPart(data);
    }
  };

  const createPart = (data: PartCreateInput) => {
    addPart(data);
    navigate('/parts');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Create New Part</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow rounded-lg p-6">
                <SimpleForm
                  onSubmit={handleSubmit}
                  onCancel={() => navigate('/parts')}
                />
              </div>
            </div>
          </div>
        </main>

        <DuplicateWarning
          duplicates={duplicates}
          isOpen={showDuplicateWarning}
          onClose={() => setShowDuplicateWarning(false)}
          onContinue={() => {
            if (pendingPart) {
              createPart(pendingPart);
            }
          }}
        />
      </div>
    </div>
  );
}