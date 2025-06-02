
"use client";

import type { Document } from "@/types";
import { DocumentCard } from "./document-card";
import { FileSearch } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  onViewDocument: (doc: Document) => void;
  onDeleteDocument: (docId: string) => void;
  onSummarizeDocument: (doc: Document) => void;
}

export function DocumentList({ documents, onViewDocument, onDeleteDocument, onSummarizeDocument }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
        <FileSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="font-headline text-xl text-muted-foreground">No Documents Found</h3>
        <p className="text-sm text-muted-foreground">Upload new documents or adjust your search filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map(doc => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onView={onViewDocument}
          onDelete={onDeleteDocument}
          onSummarize={onSummarizeDocument}
        />
      ))}
    </div>
  );
}
