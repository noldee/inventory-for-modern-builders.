"use client" // <--- Agregamos esto para poder usar hooks

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const pathname = usePathname()

  // Función para convertir la URL en un título bonito
  const getPageTitle = (path: string) => {
    // Dividimos la ruta y tomamos el último segmento
    const segments = path.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (!lastSegment || lastSegment === "dashboard") return "Dashboard"

    // Mapeo de rutas a nombres amigables
    const titles: Record<string, string> = {
      productos: "Gestión de Productos",
      categorias: "Categorías",
      proveedores: "Proveedores",
      movimientos: "Movimientos",
      reportes: "Reportes"
    }

    return titles[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Título Dinámico */}
        <h1 className="text-base font-medium transition-all">
          {getPageTitle(pathname)}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/vuestro-repo" // Actualiza esto si quieres
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}