export interface ChangeLogEntry {
  id: string;
  partNumber: string;
  type: 'status' | 'revision' | 'variant' | 'note';
  description: string;
  oldValue?: string;
  newValue?: string;
  comment: string;
  userInitials: string;
  timestamp: string;
}

export interface ChangeLogInput {
  type: ChangeLogEntry['type'];
  description: string;
  oldValue?: string;
  newValue?: string;
  comment: string;
  userInitials: string;
}