import { Part } from '../types/part';

export const sampleParts: Part[] = [
  {
    id: '1',
    partNumber: 'ASM-001-A',
    description: 'Main Assembly Housing',
    category: 'Assembly',
    status: 'active',
    revision: 'A',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    metadata: {
      material: 'Aluminum',
      weight: '2.5kg',
      supplier: 'MetalCorp Inc'
    }
  },
  {
    id: '2',
    partNumber: 'COMP-102-B',
    description: 'Circuit Board Assembly',
    category: 'Electronics',
    status: 'active',
    revision: 'B',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-03-15'),
    metadata: {
      voltage: '12V',
      certification: 'CE, UL',
      manufacturer: 'TechPro Electronics'
    }
  },
  {
    id: '3',
    partNumber: 'FAS-203-A',
    description: 'Mounting Bracket',
    category: 'Hardware',
    status: 'obsolete',
    revision: 'A',
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-04-01'),
    metadata: {
      material: 'Steel',
      finish: 'Zinc Plated',
      supplier: 'FastenerPro'
    }
  }
];