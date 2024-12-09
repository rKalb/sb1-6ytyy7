import React from 'react';

interface PartMetadataProps {
  metadata: Record<string, string>;
}

export function PartMetadata({ metadata }: PartMetadataProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {Object.entries(metadata).map(([key, value]) => (
        <React.Fragment key={key}>
          <div className="text-sm font-medium text-gray-500">{key}</div>
          <div className="text-sm text-gray-900">{value}</div>
        </React.Fragment>
      ))}
    </div>
  );
}