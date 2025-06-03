import DescargaPDF from "@/components/DescargaPDF";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resultados Médicos</h1>
      <DescargaPDF />
    </div>
  );
}
