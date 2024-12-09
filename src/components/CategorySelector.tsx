import React from 'react';
import { categories } from '../types/categories';

interface CategorySelectorProps {
  onSelect: (categoryId: string, subcategoryId: string) => void;
  initialCategory?: string;
  initialSubcategory?: string;
  required?: boolean;
  showLabels?: boolean;
}

export function CategorySelector({ 
  onSelect, 
  initialCategory = '', 
  initialSubcategory = '',
  required = false,
  showLabels = true
}: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState(initialSubcategory);

  React.useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedSubcategory(initialSubcategory);
  }, [initialCategory, initialSubcategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
    onSelect(selectedCategory, subcategoryId);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-4">
      <div>
        {showLabels && (
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required={required}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategoryData?.subcategories && (
        <div>
          {showLabels && (
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required={required}
          >
            <option value="">Select Subcategory</option>
            {selectedCategoryData.subcategories.map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}