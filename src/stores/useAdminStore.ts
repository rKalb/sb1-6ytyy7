import { create } from 'zustand';
import { produce } from 'immer';
import { Category, categories as initialCategories } from '../types/categories';
import { CategoryMetadata, MetadataField, categoryMetadata as initialMetadata } from '../types/metadata';

interface AdminStore {
  categories: Category[];
  metadata: CategoryMetadata;
  addCategory: (name: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, name: string) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<Category>) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  setMetadataFields: (categoryId: string, subcategoryId: string, fields: MetadataField[]) => void;
  updateMetadataField: (categoryId: string, subcategoryId: string, fieldKey: string, updates: Partial<MetadataField>) => void;
  deleteMetadataField: (categoryId: string, subcategoryId: string, fieldKey: string) => void;
}

const generateNextId = (existingIds: string[]): string => {
  const maxId = Math.max(...existingIds.map(id => parseInt(id, 10)), 0);
  return (maxId + 1).toString().padStart(2, '0');
};

export const useAdminStore = create<AdminStore>((set) => ({
  categories: initialCategories,
  metadata: initialMetadata,

  addCategory: (name) => set(
    produce((state) => {
      const nextId = generateNextId(state.categories.map(c => c.id));
      state.categories.push({ id: nextId, name });
    })
  ),

  updateCategory: (id, updates) => set(
    produce((state) => {
      const category = state.categories.find(c => c.id === id);
      if (category) {
        Object.assign(category, updates);
      }
    })
  ),

  deleteCategory: (id) => set(
    produce((state) => {
      const index = state.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        delete state.metadata[id];
        state.categories.splice(index, 1);
      }
    })
  ),

  addSubcategory: (categoryId, name) => set(
    produce((state) => {
      const category = state.categories.find(c => c.id === categoryId);
      if (category) {
        if (!category.subcategories) {
          category.subcategories = [];
        }
        const nextId = generateNextId(
          category.subcategories.map(s => s.id)
        );
        category.subcategories.push({ id: nextId, name });
      }
    })
  ),

  updateSubcategory: (categoryId, subcategoryId, updates) => set(
    produce((state) => {
      const category = state.categories.find(c => c.id === categoryId);
      if (category?.subcategories) {
        const subcategory = category.subcategories.find(s => s.id === subcategoryId);
        if (subcategory) {
          Object.assign(subcategory, updates);
        }
      }
    })
  ),

  deleteSubcategory: (categoryId, subcategoryId) => set(
    produce((state) => {
      const category = state.categories.find(c => c.id === categoryId);
      if (category?.subcategories) {
        const index = category.subcategories.findIndex(s => s.id === subcategoryId);
        if (index !== -1) {
          if (state.metadata[categoryId]) {
            delete state.metadata[categoryId][subcategoryId];
          }
          category.subcategories.splice(index, 1);
        }
      }
    })
  ),

  setMetadataFields: (categoryId, subcategoryId, fields) => set(
    produce((state) => {
      if (!state.metadata[categoryId]) {
        state.metadata[categoryId] = {};
      }
      state.metadata[categoryId][subcategoryId] = fields;
    })
  ),

  updateMetadataField: (categoryId, subcategoryId, fieldKey, updates) => set(
    produce((state) => {
      if (state.metadata[categoryId]?.[subcategoryId]) {
        const fieldIndex = state.metadata[categoryId][subcategoryId].findIndex(f => f.key === fieldKey);
        if (fieldIndex !== -1) {
          state.metadata[categoryId][subcategoryId][fieldIndex] = {
            ...state.metadata[categoryId][subcategoryId][fieldIndex],
            ...updates
          };
        }
      }
    })
  ),

  deleteMetadataField: (categoryId, subcategoryId, fieldKey) => set(
    produce((state) => {
      if (state.metadata[categoryId]?.[subcategoryId]) {
        state.metadata[categoryId][subcategoryId] = state.metadata[categoryId][subcategoryId]
          .filter(f => f.key !== fieldKey);
      }
    })
  ),
}));