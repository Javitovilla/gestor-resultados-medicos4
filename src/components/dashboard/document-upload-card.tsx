
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, Image as ImageIcon, Tag } from "lucide-react";
import type { Document, DocumentType } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadCardProps {
  onDocumentAdd: (newDocument: Document) => void;
}

export function DocumentUploadCard({ onDocumentAdd }: DocumentUploadCardProps) {
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("pdf");
  const [textContent, setTextContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const { toast } = useToast();

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName || !documentType) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a name and type for the document.",
      });
      return;
    }

    const newDocument: Document = {
      id: crypto.randomUUID(),
      name: documentName,
      type: documentType,
      uploadDate: new Date().toISOString(),
      textContent: textContent,
      tags: tags,
      summary: "",
      fileUrl: fileName ? `/mock-docs/${fileName}` : undefined, // Mock URL
      size: fileName ? `${(Math.random() * 5 + 0.5).toFixed(1)} MB` : undefined,
    };
    onDocumentAdd(newDocument);
    toast({
      title: "Document Added",
      description: `${documentName} has been successfully added.`,
      className: "bg-accent text-accent-foreground"
    });

    // Reset form
    setDocumentName("");
    setTextContent("");
    setTags([]);
    setCurrentTag("");
    setFileName(null);
    // @ts-ignore
    if (e.target && e.target.fileInput) e.target.fileInput.value = null; 
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!documentName) {
        setDocumentName(file.name.split('.').slice(0, -1).join('.') || file.name);
      }
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'pdf') setDocumentType('pdf');
      else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension || '')) setDocumentType('image');
      else setDocumentType('other');
    } else {
      setFileName(null);
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" /> Upload New Document
        </CardTitle>
        <CardDescription>Add your medical results to the system. Provide text content for AI summarization.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input 
              id="documentName" 
              placeholder="e.g., Blood Test Results 2024" 
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileInput">Select File (Optional)</Label>
            <Input 
              id="fileInput" 
              type="file"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)} required>
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf"><FileText className="inline mr-2 h-4 w-4" />PDF</SelectItem>
                <SelectItem value="image"><ImageIcon className="inline mr-2 h-4 w-4" />Image</SelectItem>
                <SelectItem value="text">Text Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="currentTag"
                placeholder="Add a tag (e.g., cardiology, annual-checkup)" 
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag();}}}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}><Tag className="mr-2 h-4 w-4" /> Add Tag</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-destructive">&times;</button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textContent">Report Text (for AI Summary)</Label>
            <Textarea 
              id="textContent"
              placeholder="Paste the text content of your medical report here for AI summarization..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
            />
          </div>
          
          <Button type="submit" className="w-full">
            <UploadCloud className="mr-2 h-4 w-4" /> Add Document
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
