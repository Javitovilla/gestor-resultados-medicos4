
"use client";
import type React from 'react';
import { Header } from "@/components/layout/header";
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-dashboard-layout-background"><p>Cargando panel...</p></div>;
  }

  if (!isAuthenticated) {
    redirect('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-dashboard-layout-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-card">
        © {new Date().getFullYear()} MediResults Manager. Todos los derechos reservados.
      </footer>
    </div>
  );
}
