"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Proveedor, proveedoresAPI } from "@/lib/api";
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
  IconPhone,
  IconMail,
  IconLoader2,
  IconTruck,
} from "@tabler/icons-react";
import { toast } from "sonner";

export function ProveedoresTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: proveedores = [], isLoading } = useQuery<Proveedor[]>({
    queryKey: ["proveedores"],
    queryFn: proveedoresAPI.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => proveedoresAPI.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      toast.success("Proveedor eliminado");
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
            Directorio de Proveedores
          </h1>
          <p className="text-sm text-muted-foreground">
            Administra tus contactos y empresas de abastecimiento.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/proveedores/nuevo")}
          className="rounded-2xl bg-foreground text-background hover:opacity-90 h-11 px-6 font-bold shadow-lg transition-all active:scale-95"
        >
          <IconPlus size={18} className="mr-2" /> Nuevo Proveedor
        </Button>
      </div>

      <div className="rounded-[24px] border border-muted/50 bg-background/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-muted/20">
              <TableHead className="text-[11px] font-bold tracking-widest uppercase py-4 pl-6">
                Empresa
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-widest uppercase">
                Contacto Directo
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-widest uppercase">
                Ubicación
              </TableHead>
              <TableHead className="text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proveedores.length > 0 ? (
              proveedores.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-muted/20 hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <IconTruck size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">
                          {p.nombre}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                          ID: {p.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <IconPhone
                          size={14}
                          className="text-muted-foreground"
                        />
                        {p.telefono || "Sin teléfono"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <IconMail size={14} className="opacity-50" />
                        {p.email || "Sin email"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {p.direccion || "—"}
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
                        confirm("¿Eliminar proveedor?") &&
                        deleteMutation.mutate(p.id)
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
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No hay proveedores registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
