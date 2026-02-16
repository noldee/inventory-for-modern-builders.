"use client";

import { useQuery } from "@tanstack/react-query";
import { productosAPI } from "@/lib/api";
import { ProductForm } from "@/components/productos/product-form";
import { useRouter, useParams } from "next/navigation";
import { IconLoader2, IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ["producto", id],
    queryFn: async () => (await productosAPI.getById(id)).data,
    enabled: !!id,
    staleTime: 0, // Forzamos a que no use data vieja de caché
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <IconLoader2 className="animate-spin text-primary" size={48} stroke={1.5} />
        <p className="text-sm font-medium animate-pulse text-muted-foreground">Cargando información del producto...</p>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <div className="bg-red-50 p-4 rounded-full text-red-500">
          <IconAlertTriangle size={40} />
        </div>
        <h2 className="text-xl font-bold">¡Ups! Producto no encontrado</h2>
        <p className="text-muted-foreground max-w-xs">El producto que intentas editar no existe o fue eliminado.</p>
        <Link href="/dashboard/productos">
          <Button variant="default" className="rounded-xl px-8">Volver al Inventario</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/productos">
            <Button variant="outline" size="icon" className="rounded-xl shadow-sm hover:bg-slate-50">
              <IconArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 italic uppercase">
              Editar Producto
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold tracking-widest uppercase">ID: {producto.id}</span>
              Modificando: <span className="font-bold text-slate-700">{producto.nombre}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50">
        {/* IMPORTANTE: El KEY aquí asegura que el formulario se RESETEE siempre con la nueva data */}
        <ProductForm 
          key={producto.id} 
          producto={producto} 
          onSuccess={() => router.push("/dashboard/productos")} 
        />
      </div>
    </div>
  );
}