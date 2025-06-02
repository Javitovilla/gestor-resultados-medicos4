
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Eye, Info } from "lucide-react";
import type { Document } from "@/types";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

// Documento de ejemplo para el paciente - Ahora un PDF local
const patientDocument: Document = {
  id: "patient-doc-001",
  name: "Reporte Médico de Ejemplo",
  type: "pdf", 
  uploadDate: new Date(2024, 7, 15, 10, 30).toISOString(), // Agosto 15, 2024
  fileUrl: "/documents/reporte_medico_ejemplo.pdf", // Ruta a un PDF local en public/documents/
  // dataAiHint ya no es necesario para PDF, pero podría mantenerse si se quisiera una miniatura
  textContent: "Paciente: Paciente Demo. Este es el contenido textual de un reporte médico de ejemplo. Incluye hallazgos importantes y un diagnóstico preliminar. Se recomienda discutir estos resultados con su médico.",
  summary: "Paciente Demo presenta un reporte médico con varios hallazgos. Se recomienda seguimiento médico para discutir los resultados en detalle.",
  tags: ["reporte", "pdf", "diagnostico"],
  size: "0.8 MB", // Tamaño de ejemplo
};

export default function DashboardPage() {
  const router = useRouter();

  const handleDownload = () => {
    if (patientDocument.fileUrl) {
      const link = document.createElement('a');
      link.href = patientDocument.fileUrl;
      link.download = patientDocument.name + (patientDocument.type === 'pdf' ? '.pdf' : `.${patientDocument.fileUrl.split('.').pop() || 'png'}`); 
      link.target = '_blank'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewDocument = () => {
    if (patientDocument.fileUrl) {
      const params = new URLSearchParams();
      params.append('fileUrl', patientDocument.fileUrl);
      params.append('fileName', patientDocument.name);
      params.append('fileType', patientDocument.type);
      // dataAiHint no es relevante para PDF en el visualizador, pero no hace daño pasarlo
      if (patientDocument.dataAiHint) {
        params.append('dataAiHint', patientDocument.dataAiHint);
      }
      router.push(`/dashboard/view-document?${params.toString()}`);
    } else {
      alert("Este documento no se puede visualizar o no tiene un archivo asociado.");
    }
  };

  const getDocumentIcon = () => {
    if (patientDocument.type === 'pdf') {
      return <FileText className="h-8 w-8 text-primary" />; 
    } else if (patientDocument.type === 'image') {
      return <FileText className="h-8 w-8 text-primary" />; // Usamos FileText para PDF
    }
    return <Info className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold text-primary">Mis Resultados Médicos</h1>
      <p className="text-lg text-muted-foreground">Bienvenido, Paciente Demo. Aquí puede gestionar su último resultado.</p>

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
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button onClick={handleViewDocument} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!patientDocument.fileUrl}>
              <Eye className="mr-2 h-4 w-4" /> Visualizar Resultado
            </Button>
            <Button onClick={handleDownload} className="w-full sm:w-auto" variant="outline" disabled={!patientDocument.fileUrl}>
              <Download className="mr-2 h-4 w-4" /> Descargar {patientDocument.type === 'pdf' ? 'PDF' : 'Documento'}
            </Button>
          </div>

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
