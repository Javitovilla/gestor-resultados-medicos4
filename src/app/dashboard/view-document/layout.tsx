
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ver Documento - MediResults Manager",
};

// Este layout simplemente pasa los children, 
// asumiendo que el layout de /dashboard se aplicará.
export default function ViewDocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
