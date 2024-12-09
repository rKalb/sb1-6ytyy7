import { Part } from '../types/part';
import { parse } from 'papaparse';

export function exportPartsToCSV(parts: Part[]): string {
  const headers = [
    'Part Number',
    'Name',
    'Description',
    'Category',
    'Status',
    'Revision',
    'Manufacturer ID',
    'Manufacturer Part Number',
    'Created At',
    'Updated At',
    'Notes',
    'Metadata'
  ];

  const rows = parts.map(part => [
    part.partNumber,
    part.name || '',
    part.description,
    part.category,
    part.status,
    part.revision,
    part.manufacturerId || '',
    part.manufacturerPartNumber || '',
    part.createdAt,
    part.updatedAt,
    part.notes || '',
    JSON.stringify(part.metadata)
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}