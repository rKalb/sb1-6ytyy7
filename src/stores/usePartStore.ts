import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Part, PartCreateInput } from '../types/part';
import { generatePartNumber, getNextSequence, getNextRevision, getNextVariance, parsePartNumber } from '../utils/partNumberGenerator';
import { config } from '../config';
import { DynamoDBService } from '../services/dynamodb';
import { debug } from '../utils/debug';

const db = config.USE_DYNAMODB ? new DynamoDBService() : null;

interface PartStore {
  parts: Part[];
  loading: boolean;
  error: string | null;
  addPart: (part: PartCreateInput) => Promise<void>;
  updatePart: (partNumber: string, updates: Partial<Part>) => Promise<void>;
  deletePart: (partNumber: string) => Promise<void>;
  updatePartStatus: (partNumber: string, status: 'active' | 'obsolete' | 'pending', comment: string, userInitials: string) => Promise<void>;
  createRevision: (partNumber: string, comment: string, userInitials: string) => Promise<void>;
  createVariant: (partNumber: string, variantName: string, comment: string, userInitials: string) => Promise<void>;
  loadParts: () => Promise<void>;
  getPart: (partNumber: string) => Promise<Part | null>;
}

export const usePartStore = create<PartStore>()(
  persist(
    (set, get) => ({
      parts: [],
      loading: false,
      error: null,

      loadParts: async () => {
        if (!db) return;
        
        set({ loading: true, error: null });
        try {
          debug.log('Loading parts from DynamoDB');
          const parts = await db.getAllParts();
          set({ parts, loading: false });
        } catch (error) {
          debug.error('Error loading parts:', error);
          set({ error: 'Failed to load parts', loading: false });
        }
      },

      getPart: async (partNumber: string) => {
        debug.log('Getting part:', partNumber);
        if (!db) return null;

        try {
          return await db.getPart(partNumber);
        } catch (error) {
          debug.error('Error getting part:', error);
          return null;
        }
      },

      addPart: async (partInput: PartCreateInput) => {
        set({ loading: true, error: null });
        try {
          debug.log('Adding new part:', partInput);

          // If using an existing Fellten part number
          if (partInput.felltenPartNumber) {
            debug.log('Using existing Fellten part number:', partInput.felltenPartNumber);
            const now = new Date().toISOString();
            const newPart: Part = {
              id: crypto.randomUUID(),
              partNumber: generatePartNumber({
                categoryId: partInput.category.substring(0, 2),
                subcategoryId: partInput.category.substring(2, 4),
                sequence: await getNextSequence(get().parts.map(p => p.partNumber)),
                variance: '00',
                revision: 'A'
              }),
              name: partInput.name,
              manufacturerId: partInput.manufacturerId,
              manufacturerPartNumber: partInput.manufacturerPartNumber,
              felltenPartNumber: partInput.felltenPartNumber,
              description: partInput.description,
              category: partInput.category,
              metadata: partInput.metadata,
              status: 'active',
              revision: 'A',
              createdAt: now,
              updatedAt: now,
              notes: partInput.notes
            };

            if (db) {
              await db.createPart(newPart);
              await get().loadParts();
            }
            return;
          }

          // Generate new part number
          const categoryId = partInput.category.substring(0, 2);
          const subcategoryId = partInput.category.substring(2, 4);
          const sequence = await getNextSequence(get().parts.map(p => p.partNumber));

          const now = new Date().toISOString();
          const newPart: Part = {
            id: crypto.randomUUID(),
            partNumber: generatePartNumber({
              categoryId,
              subcategoryId,
              sequence,
              variance: '00',
              revision: 'A'
            }),
            name: partInput.name,
            manufacturerId: partInput.manufacturerId,
            manufacturerPartNumber: partInput.manufacturerPartNumber,
            description: partInput.description,
            category: partInput.category,
            metadata: partInput.metadata,
            status: 'active',
            revision: 'A',
            createdAt: now,
            updatedAt: now,
            notes: partInput.notes
          };

          if (db) {
            await db.createPart(newPart);
            await get().loadParts();
          }
        } catch (error) {
          debug.error('Error adding part:', error);
          set({ error: 'Failed to add part', loading: false });
          throw error;
        }
      },

      updatePart: async (partNumber: string, updates: Partial<Part>) => {
        set({ loading: true, error: null });
        try {
          debug.log('Updating part:', { partNumber, updates });
          
          if (db) {
            await db.updatePart(partNumber, updates);
            await get().loadParts();
          }
        } catch (error) {
          debug.error('Error updating part:', error);
          set({ error: 'Failed to update part', loading: false });
          throw error;
        }
      },

      deletePart: async (partNumber: string) => {
        set({ loading: true, error: null });
        try {
          debug.log('Deleting part:', partNumber);
          
          if (db) {
            await db.deletePart(partNumber);
            await get().loadParts();
          }
        } catch (error) {
          debug.error('Error deleting part:', error);
          set({ error: 'Failed to delete part', loading: false });
          throw error;
        }
      },

      updatePartStatus: async (partNumber: string, status: 'active' | 'obsolete' | 'pending', comment: string, userInitials: string) => {
        try {
          debug.log('Updating part status:', { partNumber, status, comment });
          
          const part = await get().getPart(partNumber);
          if (!part) {
            throw new Error('Part not found');
          }

          const changeLogEntry = {
            id: crypto.randomUUID(),
            partNumber,
            type: 'status' as const,
            description: 'Status change',
            oldValue: part.status,
            newValue: status,
            comment,
            userInitials,
            timestamp: new Date().toISOString()
          };

          if (db) {
            await db.updatePart(partNumber, { status });
            await db.addChangeLogEntry(changeLogEntry);
            await get().loadParts();
          }
        } catch (error) {
          debug.error('Error updating part status:', error);
          throw error;
        }
      },

      createRevision: async (partNumber: string, comment: string, userInitials: string) => {
        try {
          debug.log('Creating revision:', { partNumber, comment });
          
          const part = await get().getPart(partNumber);
          if (!part) {
            throw new Error('Part not found');
          }

          const components = parsePartNumber(part.partNumber);
          if (!components) {
            throw new Error('Invalid part number format');
          }

          const nextRevision = getNextRevision(components.revision);
          const now = new Date().toISOString();

          const newPart: Part = {
            ...part,
            id: crypto.randomUUID(),
            partNumber: generatePartNumber({
              ...components,
              revision: nextRevision
            }),
            revision: nextRevision,
            status: 'active',
            createdAt: now,
            updatedAt: now,
          };

          const changeLogEntry = {
            id: crypto.randomUUID(),
            partNumber: newPart.partNumber,
            type: 'revision' as const,
            description: 'New revision created',
            oldValue: part.revision,
            newValue: nextRevision,
            comment,
            userInitials,
            timestamp: now
          };

          if (db) {
            await db.updatePart(partNumber, { status: 'obsolete' });
            await db.createPart(newPart);
            await db.addChangeLogEntry(changeLogEntry);
            await get().loadParts();
          }
        } catch (error) {
          debug.error('Error creating revision:', error);
          throw error;
        }
      },

      createVariant: async (partNumber: string, variantName: string, comment: string, userInitials: string) => {
        try {
          debug.log('Creating variant:', { partNumber, variantName, comment });
          
          const part = await get().getPart(partNumber);
          if (!part) {
            throw new Error('Part not found');
          }

          const components = parsePartNumber(part.partNumber);
          if (!components) {
            throw new Error('Invalid part number format');
          }

          const existingVariants = get().parts
            .map(p => parsePartNumber(p.partNumber))
            .filter((p): p is NonNullable<typeof components> => 
              p !== null && 
              p.categoryId === components.categoryId && 
              p.subcategoryId === components.subcategoryId &&
              p.sequence === components.sequence
            )
            .map(p => p.variance);

          const nextVariance = getNextVariance(
            Math.max(...existingVariants.map(v => parseInt(v, 10))).toString().padStart(2, '0')
          );

          const now = new Date().toISOString();
          const newPart: Part = {
            ...part,
            id: crypto.randomUUID(),
            partNumber: generatePartNumber({
              ...components,
              variance: nextVariance,
              revision: 'A'
            }),
            revision: 'A',
            status: 'active',
            variantName,
            createdAt: now,
            updatedAt: now,
          };

          const changeLogEntry = {
            id: crypto.randomUUID(),
            partNumber: newPart.partNumber,
            type: 'variant' as const,
            description: `New variant created: ${variantName}`,
            comment,
            userInitials,
            timestamp: now
          };

          if (db) {
            await db.createPart(newPart);
            await db.addChangeLogEntry(changeLogEntry);
            await get().loadParts();
          }
        } catch (error) {
          debug.error('Error creating variant:', error);
          throw error;
        }
      }
    }),
    {
      name: `${config.LOCAL_STORAGE_PREFIX}parts-storage`,
    }
  )
);

// Initialize parts from DynamoDB if enabled
if (config.USE_DYNAMODB) {
  usePartStore.getState().loadParts();
}