
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Info, FileImage } from "lucide-react";
import type { Document } from "@/types";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import NextImage from 'next/image'; // Renamed to avoid conflict with Document type 'image'

// Sample document for the patient, focused on PDF as per requirement
const patientDocument: Document = {
  id: "patient-doc-001",
  name: "Mis Resultados de Laboratorio - Julio 2024",
  type: "pdf", 
  uploadDate: new Date(2024, 6, 15, 10, 30).toISOString(), // July 15, 2024
  fileUrl: "https://placehold.co/800x1100.pdf", 
  textContent: "Paciente: Paciente Demo. Resultados del hemograma completo y perfil lipídico. Todos los valores se encuentran dentro de los rangos de referencia normales. Se recomienda seguimiento anual.",
  summary: "Paciente Demo presenta resultados de laboratorio normales para el periodo evaluado. Se aconseja continuar con un estilo de vida saludable y realizar controles médicos anuales según indicación.",
  tags: ["laboratorio", "chequeo-anual", "perfil-lipidico"],
  size: "1.2 MB",
};

export default function DashboardPage() {
  const handleDownload = () => {
    if (patientDocument.fileUrl) {
      const link = document.createElement('a');
      link.href = patientDocument.fileUrl;
      // Forcing download for placeholder PDFs might not work as expected without server-side help
      // For real files, this would be more straightforward or handled by a backend.
      link.download = patientDocument.name + (patientDocument.type === 'pdf' ? '.pdf' : ''); // Ensure correct extension
      link.target = '_blank'; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getDocumentIcon = () => {
    if (patientDocument.type === 'pdf') {
      return <FileText className="h-8 w-8 text-primary" />;
    } else if (patientDocument.type === 'image') {
      return <FileImage className="h-8 w-8 text-primary" />;
    }
    return <Info className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold text-primary">Mis Resultados Médicos</h1>
      <p className="text-lg text-muted-foreground">Bienvenido, Paciente Demo. Aquí puede ver y descargar su último resultado.</p>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-4">
            {getDocumentIcon()}
            <div>
              <CardTitle className="font-headline text-2xl">{patientDocument.name}</CardTitle>
              <CardDescription>
                Subido el: {format(new Date(patientDocument.uploadDate), "PPPp", { locale: es })}
                {patientDocument.size && ` • Tamaño: ${patientDocument.size}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-foreground/90">Resumen del Documento:</h3>
            <div className="bg-secondary/50 p-4 rounded-lg border">
              <p className="text-muted-foreground leading-relaxed">
                {patientDocument.summary || "No hay resumen disponible para este documento."}
              </p>
            </div>
          </div>

          {patientDocument.type === 'pdf' && patientDocument.fileUrl ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground/90">Visualizador del Documento (PDF):</h3>
              <div className="border rounded-lg overflow-hidden shadow-inner bg-muted/10">
                <iframe
                  // Adding parameters to try and hide toolbar for a cleaner patient view
                  src={`${patientDocument.fileUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                  width="100%"
                  height="700px" // Ensure sufficient height for viewing
                  className="min-h-[500px] md:min-h-[700px] border-0" // Removed border from iframe, parent has it
                  title="Visor de PDF del Paciente"
                  aria-label={`Documento PDF: ${patientDocument.name}`}
                />
              </div>
              <Button onClick={handleDownload} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
            </div>
          ) : patientDocument.type === 'image' && patientDocument.fileUrl ? (
            // Fallback for image type, though prompt focuses on PDF
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground/90">Vista Previa de Imagen:</h3>
              <div className="border rounded-lg overflow-hidden p-4 flex justify-center items-center bg-secondary/20 min-h-[300px]">
                <NextImage
                  src={patientDocument.fileUrl}
                  alt={patientDocument.name}
                  data-ai-hint={patientDocument.dataAiHint || "medical scan"}
                  width={500} // Adjust as needed
                  height={700} // Adjust as needed
                  className="max-w-full h-auto rounded-md object-contain shadow-md"
                />
              </div>
              <Button onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Descargar Imagen
              </Button>
            </div>
          ) : (
            // Fallback for other types or if no fileUrl
            <div className="p-6 border rounded-lg bg-secondary/30 text-center space-y-3">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-semibold text-lg">Documento no Visualizable Directamente</h3>
              <p className="text-muted-foreground">
                El tipo de documento ({patientDocument.type}) no permite una vista previa directa en esta pantalla.
              </p>
              {patientDocument.fileUrl && (
                 <Button onClick={handleDownload} className="mt-4">
                   <Download className="mr-2 h-4 w-4" /> Descargar Archivo Original
                 </Button>
              )}
              {!patientDocument.fileUrl && (
                <p className="text-sm text-destructive">No hay archivo asociado para descargar.</p>
              )}
            </div>
          )}
          
          {patientDocument.textContent && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2 text-foreground/90">Contenido de Texto (si aplica):</h3>
              <div className="p-4 border rounded-lg bg-secondary/20 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {patientDocument.textContent}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
