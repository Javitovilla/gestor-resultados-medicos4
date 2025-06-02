
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileImage, Eye, Info } from "lucide-react";
import type { Document } from "@/types";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

// Documento de ejemplo para el paciente - Ahora una imagen de Rayos X
const patientDocument: Document = {
  id: "patient-doc-001",
  name: "Radiografía de Rodilla - Agosto 2024",
  type: "image", 
  uploadDate: new Date(2024, 7, 5, 9, 15).toISOString(), // Agosto 5, 2024
  fileUrl: "https://placehold.co/600x800.png", // Placeholder para imagen de Rayos X
  dataAiHint: "knee x-ray", // Pista para la imagen
  textContent: "Paciente: Paciente Demo. Radiografía de rodilla derecha, proyecciones AP y lateral. Se observa integridad de las estructuras óseas, sin evidencia de fracturas agudas o luxaciones. Espacios articulares conservados. Leves signos de osteoartrosis incipiente.",
  summary: "Paciente Demo presenta una radiografía de rodilla con hallazgos de osteoartrosis incipiente, sin fracturas. Se recomienda seguimiento médico.",
  tags: ["radiografia", "rodilla", "diagnostico-por-imagen"],
  size: "0.8 MB",
};

export default function DashboardPage() {
  const router = useRouter();

  const handleDownload = () => {
    if (patientDocument.fileUrl) {
      const link = document.createElement('a');
      link.href = patientDocument.fileUrl;
      // Para imágenes, el nombre de descarga puede ser solo el nombre, el navegador inferirá la extensión por el tipo de contenido o la URL
      link.download = patientDocument.name; 
      link.target = '_blank'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewDocument = () => {
    if (patientDocument.fileUrl) {
      router.push(`/dashboard/view-document?fileUrl=${encodeURIComponent(patientDocument.fileUrl)}&fileName=${encodeURIComponent(patientDocument.name)}&fileType=${patientDocument.type}`);
    } else {
      alert("Este documento no se puede visualizar o no tiene un archivo asociado.");
    }
  };

  const getDocumentIcon = () => {
    if (patientDocument.type === 'pdf') {
      return <FileImage className="h-8 w-8 text-primary" />; // Cambiado a FileImage si es PDF, debe ser FileText
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
              <Download className="mr-2 h-4 w-4" /> Descargar {patientDocument.type === 'pdf' ? 'PDF' : 'Imagen'}
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
