"use client";
import { useRouter } from "next/navigation";
import { ProviderForm } from "@/components/proveedores/provider-form";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconTruck } from "@tabler/icons-react";

export default function NewProviderPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/proveedores")}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <IconArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <div className="flex items-center gap-4 mb-10">
        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <IconTruck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Proveedor</h1>
          <p className="text-muted-foreground">
            Gestiona tus fuentes de abastecimiento.
          </p>
        </div>
      </div>
      <div className="bg-background border border-muted/50 rounded-3xl p-8 shadow-sm">
        <ProviderForm onSuccess={() => router.push("/dashboard/proveedores")} />
      </div>
    </div>
  );
}
