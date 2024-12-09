import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/20/solid';
import { usePartStore } from '../stores/usePartStore';
import { PartDetails } from '../components/PartDetails';
import { PartActions } from '../components/PartActions';

export function PartDetailsPage() {
  const { partNumber } = useParams();
  const navigate = useNavigate();
  const { parts } = usePartStore();
  
  const part = React.useMemo(() => 
    parts.find(p => p.partNumber === partNumber),
    [parts, partNumber]
  );

  if (!part) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">Part not found</h2>
          <p className="mt-2 text-gray-600">The part you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/parts"
            className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Parts List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header className="mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <Link
                    to="/parts"
                    className="mr-4 text-indigo-600 hover:text-indigo-500"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                    {part.partNumber}
                  </h1>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() => navigate(`/parts/${partNumber}/edit`)}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <PartDetails part={part} />
              <PartActions part={part} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}