import React from 'react';
import { usePartStore } from '../stores/usePartStore';
import { exportPartsToCSV, downloadCSV, parseCSVFile } from '../utils/csvUtils';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';

export function AdminDataManagement() {
  const { parts, importParts } = usePartStore();
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
      await importParts(data);
      alert('Parts imported successfully!');
      
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
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Data Management</h2>
        
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Export Data</h3>
            <p className="mt-1 text-sm text-gray-500">
              Download all parts data as a CSV file for backup or analysis.
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Export Parts to CSV
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Import Data</h3>
            <p className="mt-1 text-sm text-gray-500">
              Import parts data from a CSV file. The file should match the export format.
            </p>
            <button
              type="button"
              onClick={handleImportClick}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Import Parts from CSV
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}