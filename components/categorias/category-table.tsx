"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Categoria, CategoriaCreate, categoriasAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconTrash,
  IconPencil,
  IconHash,
  IconLoader2,
} from "@tabler/icons-react";
import { toast } from "sonner";

export function CategoriesTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categorias = [], isLoading } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: categoriasAPI.getAll,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriasAPI.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar categoría");
    },
  });

  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center">
        <IconLoader2
          className="animate-spin text-muted-foreground opacity-20"
          size={32}
        />
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6 antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            Gestión de Categorías
          </h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus productos por familias y tipos.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/categorias/nuevo")}
          className="rounded-2xl bg-foreground text-background hover:opacity-90 h-11 px-6 font-bold shadow-lg transition-all active:scale-95"
        >
          <IconPlus size={18} className="mr-2" /> Nueva Categoría
        </Button>
      </div>

      <div className="rounded-[24px] border border-muted/50 bg-background/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-muted/20">
              <TableHead className="w-[80px] text-[11px] font-bold tracking-widest uppercase py-4 pl-6">
                ID
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-widest uppercase">
                Nombre
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-widest uppercase">
                Descripción
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-widest uppercase text-center">
                Productos
              </TableHead>
              <TableHead className="text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="border-muted/20 hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                    #{cat.id}
                  </TableCell>
                  <TableCell className="font-bold text-sm tracking-tight">
                    {cat.nombre}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                    {cat.descripcion || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {cat.productos?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600"
                    >
                      <IconPencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600"
                      onClick={() =>
                        confirm("¿Eliminar categoría?") &&
                        deleteMutation.mutate(cat.id)
                      }
                    >
                      <IconTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No hay categorías registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
