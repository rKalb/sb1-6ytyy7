export interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

export const categories: Category[] = [
  {
    id: '02',
    name: 'SYSTEMS',
    subcategories: [
      { id: '01', name: 'Vehicle On-Road Kits' },
      { id: '02', name: 'Vehicle Off-Highway Kits' },
      { id: '03', name: 'Energy Storage Integrated System' },
      { id: '04', name: 'Marine Kits' }
    ]
  },
  {
    id: '03',
    name: 'VCU'
  },
  {
    id: '04',
    name: 'ENERGY STORAGE (ESS)',
    subcategories: [
      { id: '01', name: 'BATTERY MODULES' },
      { id: '02', name: 'BATTERY PACKS' },
      { id: '03', name: 'Battery Energy Storage System' }
    ]
  },
  {
    id: '05',
    name: 'TRACTION UNITS (HVMOTION)',
    subcategories: [
      { id: '01', name: 'MOTORS' },
      { id: '02', name: 'INVERTERS' },
      { id: '03', name: 'DRIVE UNIT' }
    ]
  },
  {
    id: '06',
    name: 'HIGH VOLTAGE (HV)',
    subcategories: [
      { id: '01', name: 'HARNESS' },
      { id: '02', name: 'HVJB' },
      { id: '03', name: 'CONTROLLER' },
      { id: '04', name: 'CABLES' },
      { id: '05', name: 'BUS BAR' }
    ]
  },
  {
    id: '07',
    name: 'LOW VOLTAGE (LV)',
    subcategories: [
      { id: '01', name: 'PDU' },
      { id: '02', name: 'HARNESS' }
    ]
  },
  {
    id: '08',
    name: 'THERMAL (THERM)',
    subcategories: [
      { id: '01', name: 'HEATER' },
      { id: '02', name: 'PUMPS' },
      { id: '03', name: 'AC' }
    ]
  },
  {
    id: '09',
    name: 'HUMAN INTERFACE (HMI)',
    subcategories: [
      { id: '01', name: 'GUAGES' }
    ]
  },
  {
    id: '10',
    name: 'TOOLS (TOOL)',
    subcategories: [
      { id: '01', name: 'DATA LOGGER' },
      { id: '02', name: 'CAN ADAPTER' },
      { id: '03', name: 'COMPUTER' }
    ]
  }
];