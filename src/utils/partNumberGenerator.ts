import { categories } from '../types/categories';
import { debug } from './debug';

interface PartNumberComponents {
  categoryId: string;
  subcategoryId: string;
  sequence: number;
  variance?: string;
  revision: string;
}

export function generatePartNumber({
  categoryId,
  subcategoryId,
  sequence,
  variance = '00',
  revision = 'A'
}: PartNumberComponents): string {
  const sequenceStr = String(sequence).padStart(6, '0');
  return `${categoryId}${subcategoryId}-${sequenceStr}-${variance}-${revision}`;
}

export function getNextSequence(existingNumbers: string[]): number {
  debug.log('Getting next global sequence');
  debug.log('Existing numbers:', existingNumbers);

  // Extract all sequences from all part numbers
  const sequences = existingNumbers
    .map(num => {
      const match = num.match(/-(\d{6})-/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));

  debug.log('Found sequences:', sequences);

  if (sequences.length === 0) {
    debug.log('No existing sequences found, starting at 1');
    return 1;
  }

  const nextSequence = Math.max(...sequences) + 1;
  debug.log('Next sequence:', nextSequence);
  return nextSequence;
}

export function getNextRevision(currentRevision: string): string {
  debug.log('Getting next revision from:', currentRevision);
  const charCode = currentRevision.charCodeAt(0);
  const nextRevision = String.fromCharCode(charCode + 1);
  debug.log('Next revision:', nextRevision);
  return nextRevision;
}

export function getNextVariance(currentVariance: string): string {
  debug.log('Getting next variance from:', currentVariance);
  const num = parseInt(currentVariance, 10);
  const nextVariance = String(num + 1).padStart(2, '0');
  debug.log('Next variance:', nextVariance);
  return nextVariance;
}

export function parsePartNumber(partNumber: string): PartNumberComponents | null {
  debug.log('Parsing part number:', partNumber);
  const match = partNumber.match(/^(\d{2})(\d{2})-(\d{6})-(\d{2})-([A-Z])$/);
  if (!match) {
    debug.warn('Invalid part number format:', partNumber);
    return null;
  }

  const [, categoryId, subcategoryId, sequence, variance, revision] = match;
  const components = {
    categoryId,
    subcategoryId,
    sequence: parseInt(sequence, 10),
    variance,
    revision
  };

  debug.log('Parsed components:', components);
  return components;
}

export function getCategoryName(categoryId: string, subcategoryId: string): string {
  const category = categories.find(c => c.id === categoryId);
  if (!category) {
    debug.warn('Category not found:', categoryId);
    return '';
  }
  
  const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
  const name = subcategory ? `${category.name} - ${subcategory.name}` : category.name;
  debug.log('Category name:', { categoryId, subcategoryId, name });
  return name;
}