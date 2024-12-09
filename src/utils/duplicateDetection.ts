import { Part, PartCreateInput } from '../types/part';

// Similarity threshold for string comparison (0-1)
const SIMILARITY_THRESHOLD = 0.8;

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

// Calculate similarity ratio between two strings (0-1)
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
}

export interface DuplicateMatch {
  part: Part;
  reasons: string[];
  similarity: number;
}

export function findPotentialDuplicates(newPart: PartCreateInput, existingParts: Part[]): DuplicateMatch[] {
  const duplicates: DuplicateMatch[] = [];

  for (const part of existingParts) {
    const reasons: string[] = [];
    let maxSimilarity = 0;

    // Check for exact Fellten part number match
    if (newPart.felltenPartNumber && part.felltenPartNumber === newPart.felltenPartNumber) {
      reasons.push('Identical Fellten part number');
      maxSimilarity = 1;
    }

    // Check for exact manufacturer part number match
    if (newPart.manufacturerPartNumber && 
        part.manufacturerPartNumber === newPart.manufacturerPartNumber &&
        part.manufacturerId === newPart.manufacturerId) {
      reasons.push('Identical manufacturer part number');
      maxSimilarity = 1;
    }

    // Check for similar names
    if (newPart.name && part.name) {
      const nameSimilarity = calculateSimilarity(newPart.name, part.name);
      if (nameSimilarity >= SIMILARITY_THRESHOLD) {
        reasons.push(`Similar name (${Math.round(nameSimilarity * 100)}% match)`);
        maxSimilarity = Math.max(maxSimilarity, nameSimilarity);
      }
    }

    // Check for similar descriptions
    const descSimilarity = calculateSimilarity(newPart.description, part.description);
    if (descSimilarity >= SIMILARITY_THRESHOLD) {
      reasons.push(`Similar description (${Math.round(descSimilarity * 100)}% match)`);
      maxSimilarity = Math.max(maxSimilarity, descSimilarity);
    }

    // If any duplicates were found, add to results
    if (reasons.length > 0) {
      duplicates.push({
        part,
        reasons,
        similarity: maxSimilarity
      });
    }
  }

  // Sort by similarity (highest first)
  return duplicates.sort((a, b) => b.similarity - a.similarity);
}