"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconCategory,
  IconChartBar,
  IconFileDownload,
  IconHelp,
  IconInnerShadowTop,
  IconLayoutDashboard,
  IconPackage,
  IconSettings,
  IconTransfer,
  IconTruck,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    // ✅ Limpia TODO el localStorage
    localStorage.clear();
    // ✅ Limpia el store de Zustand
    logout();
    // ✅ Redirige al login
    router.push('/login');
  };

  const data = {
    user: {
      name: username || "Usuario",
      email: "admin@ferreteria.com",
      avatar: "/avatars/default.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconLayoutDashboard,
      },
      {
        title: "Productos",
        url: "/dashboard/productos",
        icon: IconPackage,
      },
      {
        title: "Categorías",
        url: "/dashboard/categorias",
        icon: IconCategory,
      },
      {
        title: "Proveedores",
        url: "/dashboard/proveedores",
        icon: IconTruck,
      },
      {
        title: "Movimientos",
        url: "/dashboard/movimientos",
        icon: IconTransfer,
      },
    ],
    navSecondary: [
      {
        title: "Configuración",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Ayuda",
        url: "#",
        icon: IconHelp,
      },
    ],
    documents: [
      {
        name: "Reportes",
        url: "/dashboard/reportes",
        icon: IconChartBar,
      },
      {
        name: "Exportar PDF",
        url: "#",
        icon: IconFileDownload,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Ferretería</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}