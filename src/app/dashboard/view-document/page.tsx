
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Maximize } from 'lucide-react';
import NextImage from 'next/image';


export default function ViewDocumentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileUrl = searchParams.get('fileUrl');
  const fileName = searchParams.get('fileName') || 'Documento';
  const fileType = searchParams.get('fileType') || 'pdf'; // Default to pdf
  const dataAiHint = searchParams.get('dataAiHint');

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName + (fileType === 'pdf' ? '.pdf' : `.${fileUrl.split('.').pop() || 'png'}`);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">No se proporcionó un archivo para visualizar.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="outline" onClick={() => router.push('/dashboard')} className="mb-4 sm:mb-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
          </Button>
          <h1 className="font-headline text-3xl font-bold text-primary truncate max-w-xl" title={fileName}>
            Visualizando: {fileName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Descargar
          </Button>
           <Button onClick={() => window.open(fileUrl, '_blank')} variant="outline">
            <Maximize className="mr-2 h-4 w-4" /> Abrir en nueva pestaña
          </Button>
        </div>
      </div>

      <Card className="shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {fileType === 'pdf' ? (
            <iframe
              src={`${fileUrl}#view=FitH&toolbar=0&navpanes=0`}
              width="100%"
              height="800px"
              className="border-0 min-h-[600px] md:min-h-[800px]"
              title={`Visor de PDF: ${fileName}`}
              aria-label={`Documento PDF: ${fileName}`}
            />
          ) : fileType === 'image' ? (
            <div className="p-4 flex justify-center items-center bg-muted/10 min-h-[500px]">
               <NextImage
                  src={fileUrl}
                  alt={fileName}
                  data-ai-hint={dataAiHint || "medical scan"} 
                  width={600} 
                  height={800} 
                  className="max-w-full h-auto max-h-[75vh] rounded-md object-contain shadow-md"
                  priority
                />
            </div>
          ) : (
             <div className="p-8 text-center">
                <p className="text-muted-foreground">Tipo de archivo no soportado para visualización directa.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
