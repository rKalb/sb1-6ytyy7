import React from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useManufacturerStore } from '../stores/useManufacturerStore';
import { debug } from '../utils/debug';

interface ManufacturerComboboxProps {
  value: string;
  onChange: (manufacturerId: string) => void;
  required?: boolean;
}

export function ManufacturerCombobox({ value, onChange, required = false }: ManufacturerComboboxProps) {
  const { manufacturers, searchManufacturers } = useManufacturerStore();
  const [query, setQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState(manufacturers);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setSearchResults(manufacturers);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchManufacturers(query);
        setSearchResults(results || []);
      } catch (error) {
        debug.error('Error searching manufacturers:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query, searchManufacturers, manufacturers]);

  const selectedManufacturer = manufacturers.find(m => m.id === value);

  return (
    <Combobox as="div" value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(manufacturerId: string) => 
            manufacturers.find(m => m.id === manufacturerId)?.name || ''
          }
          placeholder="Search manufacturers..."
          required={required}
          autoComplete="off"
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Loading...
            </div>
          ) : searchResults.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              No manufacturers found.
            </div>
          ) : (
            searchResults.map((manufacturer) => (
              <Combobox.Option
                key={manufacturer.id}
                value={manufacturer.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span className={`truncate ${selected ? 'font-semibold' : ''}`}>
                        {manufacturer.name}
                      </span>
                      <span className={`ml-2 truncate text-gray-500 ${active ? 'text-indigo-200' : ''}`}>
                        ({manufacturer.code})
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}