
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Info, FileImage, Eye } from "lucide-react";
import type { Document } from "@/types";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

// Documento de ejemplo para el paciente
const patientDocument: Document = {
  id: "patient-doc-001",
  name: "Mis Resultados de Laboratorio - Julio 2024",
  type: "pdf", 
  uploadDate: new Date(2024, 6, 15, 10, 30).toISOString(), // Julio 15, 2024
  fileUrl: "https://placehold.co/800x1100.pdf", 
  textContent: "Paciente: Paciente Demo. Resultados del hemograma completo y perfil lipídico. Todos los valores se encuentran dentro de los rangos de referencia normales. Se recomienda seguimiento anual.",
  summary: "Paciente Demo presenta resultados de laboratorio normales para el periodo evaluado. Se aconseja continuar con un estilo de vida saludable y realizar controles médicos anuales según indicación.",
  tags: ["laboratorio", "chequeo-anual", "perfil-lipidico"],
  size: "1.2 MB",
};

export default function DashboardPage() {
  const router = useRouter();

  const handleDownload = () => {
    if (patientDocument.fileUrl) {
      const link = document.createElement('a');
      link.href = patientDocument.fileUrl;
      link.download = patientDocument.name + (patientDocument.type === 'pdf' ? '.pdf' : '');
      link.target = '_blank'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewDocument = () => {
    if (patientDocument.fileUrl && patientDocument.type === 'pdf') {
      router.push(`/dashboard/view-document?fileUrl=${encodeURIComponent(patientDocument.fileUrl)}&fileName=${encodeURIComponent(patientDocument.name)}`);
    } else if (patientDocument.fileUrl && patientDocument.type === 'image') {
      // Podríamos tener una ruta similar para imágenes si se desea en el futuro
       router.push(`/dashboard/view-document?fileUrl=${encodeURIComponent(patientDocument.fileUrl)}&fileName=${encodeURIComponent(patientDocument.name)}&fileType=image`);
    } else {
      // Manejar otros tipos o si no hay URL
      alert("Este documento no se puede visualizar o no tiene un archivo asociado.");
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
              <Download className="mr-2 h-4 w-4" /> Descargar PDF
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
