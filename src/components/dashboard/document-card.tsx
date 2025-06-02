
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Image as ImageIcon, FileQuestion, Download, Eye, Tag, Trash2, Activity } from "lucide-react";
import type { Document } from "@/types";
import { format } from "date-fns";

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDelete: (docId: string) => void;
  onSummarize: (doc: Document) => void;
}

const getIconForType = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return <FileText className="h-5 w-5 text-destructive" />;
    case 'image': return <ImageIcon className="h-5 w-5 text-blue-500" />;
    case 'text': return <FileText className="h-5 w-5 text-green-500" />;
    default: return <FileQuestion className="h-5 w-5 text-muted-foreground" />;
  }
};

export function DocumentCard({ document, onView, onDelete, onSummarize }: DocumentCardProps) {
  const handleDownloadOriginal = () => {
    if (document.fileUrl) {
      // In a real app, this would trigger a download. Here, we just log or open a new tab.
      window.open(document.fileUrl, '_blank');
    } else {
      alert("No original file URL available for this document.");
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1 flex items-center">
            {getIconForType(document.type)}
            <span className="ml-2">{document.name}</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onDelete(document.id)} aria-label="Delete document" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Uploaded: {format(new Date(document.uploadDate), "MMM dd, yyyy, p")}
          {document.size && ` • Size: ${document.size}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {document.summary ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            <strong>Summary:</strong> {document.summary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No summary available. Click "Summarize" to generate one.</p>
        )}
        {document.tags.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold mb-1 text-muted-foreground flex items-center"><Tag className="h-3 w-3 mr-1" />Tags:</h4>
            <div className="flex flex-wrap gap-1">
              {document.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4 border-t">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => onView(document)} className="flex-1 sm:flex-none">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
          {document.fileUrl && (
            <Button variant="outline" size="sm" onClick={handleDownloadOriginal} className="flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" /> Original
            </Button>
          )}
        </div>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onSummarize(document)} 
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          disabled={!document.textContent && document.type !== 'text'}
        >
          <Activity className="mr-2 h-4 w-4" /> Summarize
        </Button>
      </CardFooter>
    </Card>
  );
}
