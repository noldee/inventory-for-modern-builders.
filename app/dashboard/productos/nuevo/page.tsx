"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/productos/product-form";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconPackage } from "@tabler/icons-react";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] antialiased">
      <div className="max-w-5xl mx-auto py-12 px-6">
        
        {/* Header con Navegación */}
        <div className="flex flex-col gap-4 mb-10">
          <Button 
            variant="ghost" 
            className="w-fit -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => router.push("/dashboard/productos")}
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inventario
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-foreground flex items-center justify-center text-background shadow-lg">
              <IconPackage size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Nuevo Producto
              </h1>
              <p className="text-muted-foreground">
                Registra un nuevo artículo completando los detalles técnicos y de stock.
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-background border border-muted/50 rounded-3xl p-8 shadow-sm">
              <ProductForm onSuccess={() => router.push("/dashboard/productos")} />
            </div>
          </div>

          {/* Sidebar de Ayuda/Info */}
          <div className="space-y-6">
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-3xl p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2 text-sm uppercase tracking-wider">Consejo de Inventario</h3>
              <p className="text-sm text-blue-800/70 dark:text-blue-300/70 leading-relaxed">
                Asegúrate de definir correctamente el <b>Stock Mínimo</b>. El sistema te notificará cuando el producto esté por agotarse.
              </p>
            </div>
            <div className="bg-card border border-muted/50 rounded-3xl p-6">
              <h3 className="font-bold mb-2 text-sm uppercase tracking-wider">¿Necesitas ayuda?</h3>
              <p className="text-sm text-muted-foreground">
                Si el proveedor no aparece en la lista, primero debes registrarlo en la sección de Proveedores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}