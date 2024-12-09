import React from 'react';
import { useAdminStore } from '../stores/useAdminStore';
import { toUpperCase } from '../utils/formatters';

export function AdminCategories() {
  const { categories, addCategory, deleteCategory, addSubcategory, deleteSubcategory } = useAdminStore();
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newSubcategory, setNewSubcategory] = React.useState({ categoryId: '', name: '' });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName) {
      addCategory(toUpperCase(newCategoryName));
      setNewCategoryName('');
    }
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubcategory.categoryId && newSubcategory.name) {
      addSubcategory(newSubcategory.categoryId, toUpperCase(newSubcategory.name));
      setNewSubcategory({ categoryId: '', name: '' });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Categories</h2>
        
        <form onSubmit={handleAddCategory} className="mt-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 min-w-0 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter category name"
                required
              />
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Category
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Add Subcategory</h3>
          <form onSubmit={handleAddSubcategory} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">
                  Parent Category
                </label>
                <select
                  id="parentCategory"
                  value={newSubcategory.categoryId}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  id="subcategoryName"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Subcategory
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Current Categories</h3>
          <div className="mt-4 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">
                    {category.name} ({category.id})
                  </h4>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-200">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between py-2">
                        <span>
                          {sub.name} ({sub.id})
                        </span>
                        <button
                          onClick={() => deleteSubcategory(category.id, sub.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}