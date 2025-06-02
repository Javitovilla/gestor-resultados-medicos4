
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileImage, Eye, Info } from "lucide-react";
import type { Document } from "@/types";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

// Documento de ejemplo para el paciente - Ahora una imagen de Rayos X local
const patientDocument: Document = {
  id: "patient-doc-001",
  name: "Radiografía de Rodilla - Ejemplo",
  type: "image", 
  uploadDate: new Date(2024, 7, 15, 10, 30).toISOString(), // Agosto 15, 2024
  fileUrl: "/images/xrays/radiografia_rodilla_ejemplo.png", // Ruta a una imagen local en public/images/xrays/
  dataAiHint: "knee x-ray", // Pista para la imagen
  textContent: "Paciente: Paciente Demo. Radiografía de rodilla derecha, proyecciones AP y lateral. Se observa integridad de las estructuras óseas, sin evidencia de fracturas agudas o luxaciones. Espacios articulares conservados. Leves signos de osteoartrosis incipiente.",
  summary: "Paciente Demo presenta una radiografía de rodilla con hallazgos de osteoartrosis incipiente, sin fracturas. Se recomienda seguimiento médico.",
  tags: ["radiografia", "rodilla", "diagnostico-por-imagen"],
  size: "1.2 MB", // Tamaño de ejemplo
};

export default function DashboardPage() {
  const router = useRouter();

  const handleDownload = () => {
    if (patientDocument.fileUrl) {
      const link = document.createElement('a');
      link.href = patientDocument.fileUrl;
      // El nombre de descarga puede ser solo el nombre, el navegador inferirá la extensión
      link.download = patientDocument.name; 
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
      if (patientDocument.dataAiHint) {
        params.append('dataAiHint', patientDocument.dataAiHint);
      }
      router.push(`/dashboard/view-document?${params.toString()}`);
    } else {
      // Idealmente, mostrarías un toast o un mensaje más amigable
      alert("Este documento no se puede visualizar o no tiene un archivo asociado.");
    }
  };

  const getDocumentIcon = () => {
    // Este icono es para la tarjeta en el dashboard, no para el visualizador
    if (patientDocument.type === 'pdf') {
      return <FileImage className="h-8 w-8 text-primary" />; 
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
