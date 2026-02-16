"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    console.log("🔍 [DASHBOARD LAYOUT] Inicializando auth...");
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    console.log("🔍 [DASHBOARD LAYOUT] isAuthenticated:", isAuthenticated);

    if (isAuthenticated === false) {
      console.log("⚠️ [DASHBOARD LAYOUT] No autenticado, redirigiendo a login");
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Mientras verifica autenticación, mostrar loading
  if (isAuthenticated === null) {
    console.log("🔍 [DASHBOARD LAYOUT] Verificando autenticación...");
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🔍 [DASHBOARD LAYOUT] No autenticado, mostrando null");
    return null;
  }

  console.log("✅ [DASHBOARD LAYOUT] Autenticado, mostrando contenido");

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background overflow-hidden flex flex-col min-w-0">
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
