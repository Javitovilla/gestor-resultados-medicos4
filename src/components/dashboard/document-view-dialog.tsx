
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/types";
import { Download, FileText, Image as ImageIcon, FileQuestion, Loader2, Send, Tag } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewDialogProps {
  document: Document | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSummarize: (docId: string, textContent: string) => Promise<string | null>; // Returns summary or null
  onUpdateDocument: (updatedDocument: Document) => void;
}

const getIconForTypeDialog = (type: Document['type'] | undefined) => {
  switch (type) {
    case 'pdf': return <FileText className="h-6 w-6 text-destructive" />;
    case 'image': return <ImageIcon className="h-6 w-6 text-blue-500" />;
    case 'text': return <FileText className="h-6 w-6 text-green-500" />;
    default: return <FileQuestion className="h-6 w-6 text-muted-foreground" />;
  }
};

export function DocumentViewDialog({ document, isOpen, onOpenChange, onSummarize, onUpdateDocument }: DocumentViewDialogProps) {
  const [currentTextContent, setCurrentTextContent] = useState(document?.textContent || "");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (document) {
      setCurrentTextContent(document.textContent || "");
    }
  }, [document]);

  if (!document) return null;

  const handleDownloadSummary = () => {
    if (!document.summary) {
      alert("No summary available to download.");
      return;
    }
    const blob = new Blob([document.summary], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${document.name}_summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  const handleDownloadOriginal = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "No original file URL available for this document.",
      });
    }
  };

  const triggerSummarization = async () => {
    if (!currentTextContent.trim()) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Please provide text content to summarize.",
      });
      return;
    }
    setIsSummarizing(true);
    const summary = await onSummarize(document.id, currentTextContent);
    setIsSummarizing(false);
    if (summary) {
      onUpdateDocument({ ...document, summary, textContent: currentTextContent });
       toast({
        title: "Summary Generated",
        description: "The AI summary has been successfully created.",
        className: "bg-accent text-accent-foreground"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not generate summary. Please try again.",
      });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
            {getIconForTypeDialog(document.type)}
            <span className="ml-3">{document.name}</span>
          </DialogTitle>
          <DialogDescription>
            Uploaded: {format(new Date(document.uploadDate), "MMMM dd, yyyy 'at' p")}
            {document.size && ` • Size: ${document.size}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 overflow-y-auto flex-grow pr-2">
          {document.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-1 flex items-center"><Tag className="h-4 w-4 mr-1" />Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {document.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm mb-1">Report Text (for AI Summary)</h4>
            <Textarea 
              placeholder="Paste or type medical report text here..."
              value={currentTextContent}
              onChange={(e) => setCurrentTextContent(e.target.value)}
              rows={8}
              className="text-sm"
            />
            <Button onClick={triggerSummarization} disabled={isSummarizing || !currentTextContent.trim()} className="mt-2 w-full sm:w-auto">
              {isSummarizing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Generate Summary with AI</>
              )}
            </Button>
          </div>

          {document.summary && (
            <div>
              <h4 className="font-semibold text-sm mb-1">AI Generated Summary:</h4>
              <div className="p-3 bg-secondary/50 rounded-md border">
                <p className="text-sm whitespace-pre-wrap">{document.summary}</p>
              </div>
            </div>
          )}
          
          {(document.type === 'image' && document.fileUrl) && (
             <div>
              <h4 className="font-semibold text-sm mb-1">Image Preview:</h4>
              <img src={document.fileUrl} alt={document.name} data-ai-hint="medical report" className="rounded-md border max-h-64 w-auto object-contain" />
            </div>
          )}

           {(document.type === 'pdf' && document.fileUrl) && (
             <div>
              <h4 className="font-semibold text-sm mb-1">PDF Document:</h4>
              <p className="text-sm text-muted-foreground">
                PDF preview is not available in this demo. You can download the original file.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-auto pt-4 border-t">
          {document.fileUrl && (
            <Button variant="outline" onClick={handleDownloadOriginal}>
              <Download className="mr-2 h-4 w-4" /> Download Original
            </Button>
          )}
          {document.summary && (
            <Button variant="outline" onClick={handleDownloadSummary}>
              <Download className="mr-2 h-4 w-4" /> Download Summary
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} variant="default">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
