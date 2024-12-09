import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SimpleForm } from '../components/PartForm/SimpleForm';
import { usePartStore } from '../stores/usePartStore';
import { debug } from '../utils/debug';

export function EditPartPage() {
  const navigate = useNavigate();
  const { partNumber } = useParams();
  const { parts, updatePart } = usePartStore();
  
  const part = React.useMemo(() => 
    parts.find(p => p.partNumber === partNumber),
    [parts, partNumber]
  );

  if (!part) {
    debug.error('Part not found:', partNumber);
    navigate('/parts');
    return null;
  }

  const handleSubmit = async (data: any) => {
    try {
      debug.log('Updating part:', { partNumber, data });
      await updatePart(partNumber!, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      navigate(`/parts/${partNumber}`);
    } catch (error) {
      debug.error('Failed to update part:', error);
      alert('Failed to update part. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Edit Part: {part.partNumber}</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow rounded-lg p-6">
                <SimpleForm
                  onSubmit={handleSubmit}
                  initialData={{
                    name: part.name,
                    category: part.category,
                    description: part.description,
                    manufacturerId: part.manufacturerId,
                    manufacturerPartNumber: part.manufacturerPartNumber,
                    felltenPartNumber: part.felltenPartNumber,
                    metadata: part.metadata,
                    notes: part.notes
                  }}
                  onCancel={() => navigate(`/parts/${partNumber}`)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}