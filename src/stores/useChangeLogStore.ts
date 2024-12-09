import { create } from 'zustand';
import { ChangeLogEntry } from '../types/changelog';
import { config } from '../config';
import { DynamoDBService } from '../services/dynamodb';
import { debug } from '../utils/debug';

interface ChangeLogStore {
  entries: ChangeLogEntry[];
  loading: boolean;
  error: string | null;
  loadEntries: (partNumber: string) => Promise<void>;
  addEntry: (entry: ChangeLogEntry) => Promise<void>;
}

const db = config.USE_DYNAMODB ? new DynamoDBService() : null;

export const useChangeLogStore = create<ChangeLogStore>((set) => ({
  entries: [],
  loading: false,
  error: null,

  loadEntries: async (partNumber: string) => {
    if (!db) return;
    
    set({ loading: true, error: null });
    try {
      debug.log('Loading changelog entries for part:', partNumber);
      const entries = await db.getChangeLogEntries(partNumber);
      debug.log('Loaded entries:', entries);
      set({ entries, loading: false });
    } catch (error) {
      debug.error('Error loading changelog entries:', error);
      set({ error: 'Failed to load changelog entries', loading: false });
    }
  },

  addEntry: async (entry: ChangeLogEntry) => {
    if (!db) return;

    set({ loading: true, error: null });
    try {
      debug.log('Adding changelog entry:', entry);
      await db.addChangeLogEntry(entry);
      set(state => ({
        entries: [entry, ...state.entries],
        loading: false
      }));
    } catch (error) {
      debug.error('Error adding changelog entry:', error);
      set({ error: 'Failed to add changelog entry', loading: false });
      throw error;
    }
  }
}));