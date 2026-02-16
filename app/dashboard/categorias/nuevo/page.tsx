"use client";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/categorias/category-form";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function NewCategoryPage() {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/categorias")}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <IconArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nueva Categoría</h1>
        <p className="text-muted-foreground">
          Define una nueva familia de productos.
        </p>
      </div>
      <div className="bg-background border border-muted/50 rounded-3xl p-8 shadow-sm">
        <CategoryForm onSuccess={() => router.push("/dashboard/categorias")} />
      </div>
    </div>
  );
}
