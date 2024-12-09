import { z } from 'zod';

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  manufacturerId?: string;
  manufacturerPartNumber?: string;
  felltenPartNumber?: string;
  description: string;
  category: string;
  status: 'active' | 'obsolete' | 'pending';
  revision: string;
  variantName?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, string>;
  notes?: string;
}

export interface PartCreateInput {
  name: string;
  manufacturerId?: string;
  manufacturerPartNumber?: string;
  felltenPartNumber?: string;
  description: string;
  category: string;
  metadata: Record<string, string>;
  variantName?: string;
  notes?: string;
}

export const partSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  manufacturerId: z.string().optional(),
  manufacturerPartNumber: z.string().optional(),
  felltenPartNumber: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(4, 'Category is required'),
  metadata: z.record(z.string(), z.string()),
  variantName: z.string().optional(),
  notes: z.string().optional()
});