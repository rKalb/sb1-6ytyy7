import React from 'react';

interface PartStatusBadgeProps {
  status: 'active' | 'obsolete' | 'pending';
}

export function PartStatusBadge({ status }: PartStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'obsolete':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles()}`}>
      {status}
    </span>
  );
}