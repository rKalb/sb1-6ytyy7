import React from 'react';
import { ChangeLogEntry } from '../types/changelog';
import { formatDate } from '../utils/formatters';

interface ChangeLogListProps {
  entries: ChangeLogEntry[];
}

export function ChangeLogList({ entries }: ChangeLogListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">No changes recorded yet.</p>
    );
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {entries.map((entry, entryIdx) => (
          <li key={entry.id}>
            <div className="relative pb-8">
              {entryIdx !== entries.length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`
                    h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                    ${entry.type === 'status' ? 'bg-yellow-500' :
                      entry.type === 'revision' ? 'bg-blue-500' :
                      entry.type === 'variant' ? 'bg-purple-500' :
                      'bg-gray-500'}
                  `}>
                    <span className="text-white text-sm font-medium">
                      {entry.type[0].toUpperCase()}
                    </span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {entry.description}
                      {entry.oldValue && entry.newValue && (
                        <span className="ml-1">
                          from <span className="font-medium">{entry.oldValue}</span>
                          {' '}to{' '}
                          <span className="font-medium">{entry.newValue}</span>
                        </span>
                      )}
                    </p>
                    {entry.comment && (
                      <p className="mt-1 text-sm text-gray-700">
                        {entry.comment}
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={entry.timestamp}>
                      {formatDate(entry.timestamp)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}