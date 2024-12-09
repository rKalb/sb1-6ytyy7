import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Manufacturer } from '../types/manufacturer';
import { toUpperCase } from '../utils/formatters';
import { config } from '../config';
import { ManufacturerService } from '../services/manufacturer';
import { debug } from '../utils/debug';

const manufacturerService = config.USE_DYNAMODB ? new ManufacturerService() : null;

interface ManufacturerStore {
  manufacturers: Manufacturer[];
  loading: boolean;
  error: string | null;
  addManufacturer: (name: string) => Promise<Manufacturer>;
  getManufacturer: (id: string) => Manufacturer | undefined;
  searchManufacturers: (query: string) => Promise<Manufacturer[]>;
  loadManufacturers: () => Promise<void>;
}

export const useManufacturerStore = create<ManufacturerStore>()(
  persist(
    (set, get) => ({
      manufacturers: [],
      loading: false,
      error: null,

      loadManufacturers: async () => {
        if (!manufacturerService) return;
        
        set({ loading: true, error: null });
        try {
          debug.log('Loading manufacturers from DynamoDB');
          const manufacturers = await manufacturerService.getAllManufacturers();
          set({ manufacturers, loading: false });
        } catch (error) {
          const message = 'Failed to load manufacturers';
          debug.error(message, error);
          set({ error: message, loading: false });
        }
      },

      addManufacturer: async (name: string) => {
        set({ loading: true, error: null });
        try {
          const upperName = toUpperCase(name);
          const code = upperName.split(' ').map(word => word[0]).join('').slice(0, 4);
          
          const newManufacturer: Omit<Manufacturer, 'id'> = {
            name: upperName,
            code
          };

          if (manufacturerService) {
            debug.log('Creating manufacturer in DynamoDB:', newManufacturer);
            const created = await manufacturerService.createManufacturer(newManufacturer);
            set(state => ({
              manufacturers: [...state.manufacturers, created],
              loading: false
            }));
            return created;
          } else {
            const created: Manufacturer = {
              ...newManufacturer,
              id: crypto.randomUUID()
            };
            set(state => ({
              manufacturers: [...state.manufacturers, created],
              loading: false
            }));
            return created;
          }
        } catch (error) {
          const message = 'Failed to add manufacturer';
          debug.error(message, error);
          set({ error: message, loading: false });
          throw error;
        }
      },

      getManufacturer: (id: string) => {
        return get().manufacturers.find(m => m.id === id);
      },

      searchManufacturers: async (query: string) => {
        if (!query.trim()) {
          return get().manufacturers;
        }

        if (manufacturerService) {
          try {
            debug.log('Searching manufacturers in DynamoDB:', query);
            return await manufacturerService.searchManufacturers(query);
          } catch (error) {
            debug.error('Error searching manufacturers:', error);
            return [];
          }
        }
        
        const lowerQuery = query.toLowerCase();
        return get().manufacturers.filter(m => 
          m.name.toLowerCase().includes(lowerQuery) ||
          m.code.toLowerCase().includes(lowerQuery)
        );
      }
    }),
    {
      name: `${config.LOCAL_STORAGE_PREFIX}manufacturers-storage`,
    }
  )
);

// Initialize manufacturers from DynamoDB if enabled
if (config.USE_DYNAMODB) {
  useManufacturerStore.getState().loadManufacturers();
}