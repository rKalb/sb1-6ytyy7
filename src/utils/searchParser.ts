import { Part } from '../types/part';

type Operator = '&' | '|';

interface SearchToken {
  type: 'exact' | 'wildcard' | 'metadata' | 'text';
  field?: string;
  value: string;
  operator?: Operator;
}

interface SearchGroup {
  tokens: SearchToken[];
  operator: Operator;
}

function parseGroup(query: string): SearchGroup {
  const tokens: SearchToken[] = [];
  let currentToken = '';
  let inQuotes = false;
  let currentOperator: Operator = '&';
  let i = 0;

  while (i < query.length) {
    const char = query[i];

    // Handle operators
    if (!inQuotes && (char === '&' || char === '|')) {
      if (currentToken) {
        tokens.push({ type: 'text', value: currentToken.trim(), operator: currentOperator });
        currentToken = '';
      }
      currentOperator = char as Operator;
      i++;
      continue;
    }

    // Handle commas (treated as OR)
    if (!inQuotes && char === ',') {
      if (currentToken) {
        tokens.push({ type: 'text', value: currentToken.trim(), operator: currentOperator });
        currentToken = '';
      }
      currentOperator = '|';
      i++;
      continue;
    }

    // Handle quoted strings
    if (char === '"') {
      if (!inQuotes) {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken.trim(), operator: currentOperator });
          currentToken = '';
        }
        inQuotes = true;
      } else {
        if (currentToken) {
          tokens.push({ type: 'exact', value: currentToken.trim(), operator: currentOperator });
          currentToken = '';
        }
        inQuotes = false;
      }
      i++;
      continue;
    }

    // Handle metadata key:value pairs
    if (!inQuotes && char === ':' && currentToken) {
      const field = currentToken.trim();
      currentToken = '';
      i++;
      
      // Collect the value after the colon
      while (i < query.length && ![' ', '&', '|', ','].includes(query[i])) {
        currentToken += query[i];
        i++;
      }
      
      if (currentToken) {
        tokens.push({ type: 'metadata', field, value: currentToken.trim(), operator: currentOperator });
        currentToken = '';
      }
      continue;
    }

    // Handle wildcards
    if (!inQuotes && char === '*') {
      if (currentToken) {
        tokens.push({ type: 'wildcard', value: currentToken.trim() + '*', operator: currentOperator });
        currentToken = '';
      }
      i++;
      continue;
    }

    // Handle spaces
    if (!inQuotes && char === ' ') {
      if (currentToken) {
        tokens.push({ type: 'text', value: currentToken.trim(), operator: currentOperator });
        currentToken = '';
      }
      i++;
      continue;
    }

    currentToken += char;
    i++;
  }

  // Handle any remaining token
  if (currentToken) {
    tokens.push({ type: 'text', value: currentToken.trim(), operator: currentOperator });
  }

  return {
    tokens,
    operator: tokens.some(t => t.operator === '|') ? '|' : '&'
  };
}

export function parseSearchQuery(query: string): SearchGroup {
  return parseGroup(query);
}

export function matchesSearchTokens(part: Part, searchGroup: SearchGroup): boolean {
  if (searchGroup.operator === '|') {
    return searchGroup.tokens.some(token => matchesToken(part, token));
  }
  return searchGroup.tokens.every(token => matchesToken(part, token));
}

function searchAllFields(part: Part, value: string): boolean {
  const searchValue = value.toLowerCase();
  
  // Search in basic fields
  if (part.partNumber.toLowerCase().includes(searchValue)) return true;
  if (part.name?.toLowerCase().includes(searchValue)) return true;
  if (part.description.toLowerCase().includes(searchValue)) return true;
  if (part.manufacturerPartNumber?.toLowerCase().includes(searchValue)) return true;
  if (part.notes?.toLowerCase().includes(searchValue)) return true;
  
  // Search in metadata values
  if (Object.values(part.metadata).some(value => 
    value.toLowerCase().includes(searchValue)
  )) return true;

  return false;
}

function matchesToken(part: Part, token: SearchToken): boolean {
  const searchValue = token.value.toLowerCase();

  switch (token.type) {
    case 'exact':
      // For exact matches, check specific fields
      return (
        part.partNumber.toLowerCase() === searchValue ||
        part.name?.toLowerCase() === searchValue ||
        part.description.toLowerCase() === searchValue ||
        part.manufacturerPartNumber?.toLowerCase() === searchValue ||
        Object.values(part.metadata).some(value => 
          value.toLowerCase() === searchValue
        )
      );

    case 'wildcard': {
      const pattern = searchValue.slice(0, -1);
      // For wildcards, check if any field starts with the pattern
      return (
        part.partNumber.toLowerCase().startsWith(pattern) ||
        part.name?.toLowerCase().startsWith(pattern) ||
        part.description.toLowerCase().startsWith(pattern) ||
        part.manufacturerPartNumber?.toLowerCase().startsWith(pattern) ||
        Object.values(part.metadata).some(value => 
          value.toLowerCase().startsWith(pattern)
        )
      );
    }

    case 'metadata':
      if (!token.field) return false;
      // For metadata searches, check the specific metadata field
      const value = part.metadata[token.field];
      return value?.toLowerCase().includes(searchValue);

    case 'text':
      // For general text searches, check all fields
      return searchAllFields(part, token.value);

    default:
      return false;
  }
}

export function generateSearchSuggestions(
  query: string,
  parts: Part[],
  limit: number = 5
): string[] {
  if (!query) return [];

  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();

  // Generate suggestions from all searchable fields
  for (const part of parts) {
    if (suggestions.size >= limit) break;

    // Add suggestions from basic fields
    if (part.partNumber.toLowerCase().includes(lowerQuery)) {
      suggestions.add(part.partNumber);
    }
    if (part.name?.toLowerCase().includes(lowerQuery)) {
      suggestions.add(`"${part.name}"`);
    }
    if (part.description.toLowerCase().includes(lowerQuery)) {
      suggestions.add(`"${part.description}"`);
    }
    if (part.manufacturerPartNumber?.toLowerCase().includes(lowerQuery)) {
      suggestions.add(`manufacturerPartNumber:${part.manufacturerPartNumber}`);
    }

    // Add metadata suggestions
    for (const [key, value] of Object.entries(part.metadata)) {
      if (
        key.toLowerCase().includes(lowerQuery) ||
        value.toLowerCase().includes(lowerQuery)
      ) {
        suggestions.add(`${key}:${value}`);
      }
    }
  }

  return Array.from(suggestions).slice(0, limit);
}