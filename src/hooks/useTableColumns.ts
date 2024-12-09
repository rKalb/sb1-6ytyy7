import { useState, useCallback, useEffect } from 'react';

export interface Column {
  key: string;
  label: string;
  visible: boolean;
}

const defaultColumns: Column[] = [
  { key: 'partNumber', label: 'Part Number', visible: true },
  { key: 'name', label: 'Name', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'category', label: 'Category', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'revision', label: 'Revision', visible: true },
  { key: 'specifications', label: 'Specifications', visible: true },
  { key: 'updatedAt', label: 'Last Updated', visible: true },
];

const STORAGE_KEY = 'plm-table-columns';

export function useTableColumns() {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem(STORAGE_KEY);
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        // Ensure all default columns exist in case new ones were added
        const mergedColumns = defaultColumns.map(defaultCol => {
          const savedCol = parsed.find((col: Column) => col.key === defaultCol.key);
          return savedCol || defaultCol;
        });
        return mergedColumns;
      } catch (error) {
        console.error('Error parsing saved columns:', error);
        return defaultColumns;
      }
    }
    return defaultColumns;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  const toggleColumn = useCallback((key: string) => {
    setColumns(current =>
      current.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  const resetColumns = useCallback(() => {
    setColumns(defaultColumns);
  }, []);

  const visibleColumns = columns.filter(col => col.visible);

  return {
    columns,
    visibleColumns,
    toggleColumn,
    resetColumns
  };
}