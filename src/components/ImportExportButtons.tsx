import React from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { usePartStore } from '../stores/usePartStore';
import { exportPartsToCSV, downloadCSV, parseCSVFile } from '../utils/csvUtils';

export function ImportExportButtons() {
  const { parts } = usePartStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const csv = exportPartsToCSV(parts);
    const filename = `parts-export-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseCSVFile(file);
      console.log('Imported data:', data);
      // TODO: Implement import logic in usePartStore
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error importing file. Please check the file format and try again.');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <ArrowDownTrayIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Export CSV
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <ArrowUpTrayIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Import CSV
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
    </div>
  );
}