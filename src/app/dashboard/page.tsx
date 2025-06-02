
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Document } from "@/types";
import { DocumentUploadCard } from "@/components/dashboard/document-upload-card";
import { SearchFilterCard } from "@/components/dashboard/search-filter-card";
import { DocumentList } from "@/components/dashboard/document-list";
import { DocumentViewDialog } from "@/components/dashboard/document-view-dialog";
import { summarizeMedicalReport } from "@/ai/flows/summarize-medical-report";
import type { DateRange } from "react-day-picker";
import { parseISO, isWithinInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const initialDocuments: Document[] = [
  {
    id: "1",
    name: "Annual Checkup Results",
    type: "pdf",
    uploadDate: new Date(2023, 10, 15, 9, 30).toISOString(),
    fileUrl: "https://placehold.co/800x1100.pdf",
    textContent: "Patient: John Doe. DOB: 1980-05-15. Blood pressure: 120/80 mmHg. Cholesterol: Total 190 mg/dL, HDL 50 mg/dL, LDL 120 mg/dL. Glucose: 90 mg/dL. Key findings: All results within normal limits. Recommendation: Continue healthy lifestyle.",
    summary: "All results are within normal limits. Patient John Doe is advised to continue a healthy lifestyle. Blood pressure 120/80, Cholesterol 190.",
    tags: ["annual-checkup", "general-health"],
    size: "1.2 MB",
  },
  {
    id: "2",
    name: "X-Ray Report - Left Arm",
    type: "image",
    uploadDate: new Date(2024, 0, 20, 14, 0).toISOString(),
    fileUrl: "https://placehold.co/600x400.png",
    dataAiHint: "x-ray medical",
    textContent: "Patient: Jane Smith. DOB: 1992-08-25. Examination: X-Ray Left Forearm. Findings: No fracture or dislocation identified. Soft tissues appear normal. Impression: Normal X-Ray of the left forearm.",
    summary: "",
    tags: ["x-ray", "orthopedics", "injury"],
    size: "850 KB",
  },
   {
    id: "3",
    name: "Cardiology Consultation Notes",
    type: "text",
    uploadDate: new Date(2024, 1, 5, 11, 15).toISOString(),
    textContent: "Patient: Robert Jones. DOB: 1975-01-10. Reason for visit: Follow-up on palpitations. ECG: Normal sinus rhythm. Echocardiogram: Mild mitral valve regurgitation, otherwise normal. Plan: Continue current medication. Follow up in 6 months.",
    summary: "Robert Jones's follow-up for palpitations shows normal sinus rhythm on ECG and mild mitral valve regurgitation on echocardiogram. Plan is to continue medication and follow up in 6 months.",
    tags: ["cardiology", "consultation", "heart"],
    size: "50 KB",
  }
];


export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { toast } = useToast();

  useEffect(() => {
    // Persist documents to localStorage for demo purposes
    const storedDocs = localStorage.getItem("mediresults-documents");
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    } else {
      setDocuments(initialDocuments); // Load initial if nothing in local storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mediresults-documents", JSON.stringify(documents));
  }, [documents]);


  const handleAddDocument = (newDocument: Document) => {
    setDocuments(prevDocs => [newDocument, ...prevDocs]);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    toast({
        title: "Document Deleted",
        description: "The document has been removed.",
      });
  };
  
  const handleUpdateDocument = (updatedDocument: Document) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => (doc.id === updatedDocument.id ? updatedDocument : doc))
    );
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDialogOpen(true);
  };

  const handleSummarize = async (docToSummarize: Document) => {
    if (docToSummarize.summary) {
      toast({ title: "Already Summarized", description: "This document already has a summary. You can view it or regenerate if needed via the view dialog."});
      handleViewDocument(docToSummarize); // Open view dialog to see existing summary or regenerate
      return;
    }
    if (!docToSummarize.textContent?.trim()) {
       toast({
        variant: "destructive",
        title: "Missing Text Content",
        description: "This document has no text content to summarize. Please add text content via the 'View' dialog.",
      });
      handleViewDocument(docToSummarize); // Open dialog to add text
      return;
    }
    
    toast({ title: "Summarization Started", description: "AI is processing the report..." });
    const summary = await summarizeMedicalReport({ reportText: docToSummarize.textContent });
    if (summary?.summary) {
      const updatedDoc = { ...docToSummarize, summary: summary.summary };
      handleUpdateDocument(updatedDoc);
      toast({
        title: "Summary Generated",
        description: "AI summary is ready.",
        className: "bg-accent text-accent-foreground"
      });
      handleViewDocument(updatedDoc); // Open dialog to show new summary
    } else {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not generate summary. Please try again later.",
      });
    }
  };
  
  // This function will be passed to the DocumentViewDialog
  const handleSummarizeFromDialog = async (docId: string, textContent: string): Promise<string | null> => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return null;

    if (!textContent.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Text",
        description: "Cannot summarize empty text.",
      });
      return null;
    }
    
    toast({ title: "Summarization Started", description: "AI is processing the report..." });
    const result = await summarizeMedicalReport({ reportText: textContent });
    if (result?.summary) {
      return result.summary;
    }
    return null;
  };


  const allAvailableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    documents.forEach(doc => doc.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const searchMatch = searchTerm.toLowerCase() === "" ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.textContent && doc.textContent.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()));

      const tagsMatch = selectedTags.length === 0 ||
        selectedTags.every(tag => doc.tags.includes(tag));

      const dateMatch = !dateRange?.from || 
        (isWithinInterval(parseISO(doc.uploadDate), {
          start: dateRange.from,
          end: dateRange.to || dateRange.from, // If only 'from' is selected, use it as 'to'
        }));
        
      return searchMatch && tagsMatch && dateMatch;
    });
  }, [documents, searchTerm, selectedTags, dateRange]);


  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold text-primary">Your Medical Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          <DocumentUploadCard onDocumentAdd={handleAddDocument} />
          <SearchFilterCard 
            onSearch={setSearchTerm} 
            onFilterByTags={setSelectedTags}
            onFilterByDateRange={setDateRange}
            allTags={allAvailableTags}
          />
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="font-headline text-3xl mb-6">Your Documents</h2>
          <DocumentList 
            documents={filteredDocuments} 
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
            onSummarizeDocument={handleSummarize}
          />
        </div>
      </div>

      {selectedDocument && (
        <DocumentViewDialog
          document={selectedDocument}
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          onSummarize={handleSummarizeFromDialog}
          onUpdateDocument={handleUpdateDocument}
        />
      )}
    </div>
  );
}
