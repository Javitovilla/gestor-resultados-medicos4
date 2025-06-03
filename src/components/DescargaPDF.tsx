// src/components/DescargaPDF.tsx
"use client";

import jsPDF from "jspdf";

export default function DescargaPDF() {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = "/imagen-pdf.png";
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 180, 250);
      doc.save("informe-rodilla.pdf");
    };
  };

  return (
    <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
      Descargar informe en PDF
    </button>
  );
}
