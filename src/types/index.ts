
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text' | 'other';
  uploadDate: string; // ISO string format
  fileUrl?: string; // Mock URL for original file
  textContent?: string; // For AI summarization input
  summary?: string;
  tags: string[];
  size?: string; // e.g., "2.5 MB"
}

export type DocumentType = Document['type'];
