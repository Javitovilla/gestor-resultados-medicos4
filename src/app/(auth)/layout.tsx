import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authenticate - MediResults Manager",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-auth-layout-background p-4">
      {children}
    </div>
  );
}
