export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
};

export const formatMetadata = (metadata: Record<string, string>): string => {
  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
};

export const generateFieldKey = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

export const toUpperCase = (text: string): string => {
  return text.toUpperCase();
};