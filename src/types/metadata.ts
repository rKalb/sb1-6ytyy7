export interface MetadataField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
  unit?: string;
  unitOptions?: string[];
}

export interface CategoryMetadata {
  [categoryId: string]: {
    [subcategoryId: string]: MetadataField[];
  };
}

export const categoryMetadata: CategoryMetadata = {
  '04': {
    '01': [ // BATTERY MODULES
      {
        key: 'voltage',
        label: 'Voltage',
        type: 'number',
        required: true,
        unit: 'V',
        unitOptions: ['V', 'kV', 'mV']
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'number',
        required: true,
        unit: 'kWh',
        unitOptions: ['kWh', 'Wh', 'MWh']
      },
      {
        key: 'chemistry',
        label: 'Cell Chemistry',
        type: 'select',
        required: true,
        options: ['NMC', 'LFP', 'NCA']
      }
    ]
  },
  '06': {
    '01': [ // HV HARNESS
      {
        key: 'maxCurrent',
        label: 'Maximum Current',
        type: 'number',
        required: true,
        unit: 'A',
        unitOptions: ['A', 'kA', 'mA']
      },
      {
        key: 'length',
        label: 'Length',
        type: 'number',
        required: true,
        unit: 'm',
        unitOptions: ['m', 'cm', 'mm', 'km']
      },
      {
        key: 'shielding',
        label: 'Shielding Type',
        type: 'select',
        required: true,
        options: ['Single', 'Double', 'Triple']
      }
    ]
  },
  '05': {
    '01': [ // MOTORS
      {
        key: 'power',
        label: 'Power',
        type: 'number',
        required: true,
        unit: 'kW',
        unitOptions: ['W', 'kW', 'MW']
      },
      {
        key: 'torque',
        label: 'Peak Torque',
        type: 'number',
        required: true,
        unit: 'Nm',
        unitOptions: ['Nm', 'kNm']
      },
      {
        key: 'cooling',
        label: 'Cooling Type',
        type: 'select',
        required: true,
        options: ['Air', 'Liquid']
      }
    ]
  }
};