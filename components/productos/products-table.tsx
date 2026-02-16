"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productosAPI } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconPlus,
  IconSearch,
  IconDotsVertical,
  IconLoader2,
  IconInbox,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductsTable() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const response = await productosAPI.getAll();
      return response.data;
    },
  });

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

    try {
      await productosAPI.eliminar(id);
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto eliminado correctamente");
    } catch (error: any) {
      toast.error(
        error.response?.status === 403
          ? "No tienes permisos para eliminar productos"
          : "Error al eliminar el producto",
      );
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "nombre",
      header: "PRODUCTO",
      cell: ({ row }) => (
        <div className="flex flex-col py-1 max-w-[250px]">
          <span className="font-bold text-foreground text-sm tracking-tight truncate">
            {row.getValue("nombre")}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            {row.original.sku || "SIN-SKU"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "categoria",
      header: "CATEGORÍA",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {row.original.categoria?.nombre || "Sin categoría"}
        </Badge>
      ),
    },
    {
      accessorKey: "proveedor",
      header: "PROVEEDOR",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.proveedor?.nombre || "Sin proveedor"}
        </span>
      ),
    },
    {
      accessorKey: "stockActual",
      header: "STOCK",
      cell: ({ row }) => {
        const stock = row.original.stockActual ?? 0;
        const min = row.original.stockMinimo ?? 0;
        const lowStock = stock <= min;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                lowStock ? "bg-red-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span
              className={`font-mono text-sm ${
                lowStock ? "text-red-500 font-bold" : "text-foreground/80"
              }`}
            >
              {stock}{" "}
              <span className="text-[10px] font-normal opacity-60 italic">
                {row.original.unidadMedida || "unid"}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "precioCompra",
      header: "P. COMPRA",
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue("precioCompra"));
        const precioValido = !isNaN(precio) ? precio : 0;
        return (
          <span className="font-mono text-sm text-blue-600 font-medium">
            ${precioValido.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "precioVenta",
      header: "P. VENTA",
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue("precioVenta"));
        const precioValido = !isNaN(precio) ? precio : 0;
        return (
          <span className="font-mono text-sm font-bold text-emerald-600">
            ${precioValido.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "ubicacion",
      header: "UBICACIÓN",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.ubicacion || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <IconDotsVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/productos/${row.original.id}/editar`)
                }
              >
                <IconEdit size={16} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={() =>
                  handleDelete(row.original.id, row.original.nombre)
                }
              >
                <IconTrash size={16} className="mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading)
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <IconLoader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Cargando inventario...
        </p>
      </div>
    );

  return (
    <div className="w-full space-y-6 antialiased">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Inventario</h1>
          <p className="text-sm text-muted-foreground font-medium">
            {productos.length} productos registrados
          </p>
        </div>

        <Link href="/dashboard/productos/nuevo">
          <Button className="rounded-xl bg-foreground text-background hover:opacity-90 px-6 font-bold shadow-xl transition-all active:scale-95">
            <IconPlus size={18} className="mr-2" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative group">
        <IconSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
          size={20}
        />
        <Input
          placeholder="Buscar producto por nombre o SKU..."
          className="pl-10 h-12 bg-background border focus:ring-1 rounded-xl shadow-sm transition-all"
          onChange={(e) =>
            table.getColumn("nombre")?.setFilterValue(e.target.value)
          }
        />
      </div>

      {/* Table */}
      {/* Contenedor Principal: shadow y bordes */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {/* Contenedor del Scroll: Este es el que debe tener el overflow-x-auto solo */}
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <Table className="w-full min-w-[1000px] table-auto border-collapse">
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="hover:bg-transparent border-border"
                >
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="text-[11px] font-black tracking-[0.1em] text-muted-foreground uppercase py-5 px-6 whitespace-nowrap"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((c) => (
                      <TableCell
                        key={c.id}
                        className="py-4 px-6 whitespace-nowrap text-sm"
                      >
                        {flexRender(c.column.columnDef.cell, c.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-60 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <IconInbox size={48} stroke={1} className="opacity-20" />
                      <p className="text-sm font-medium">
                        No se encontraron productos en el inventario.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación: Fuera del div de scroll para que esté siempre visible */}
        {table.getRowModel().rows.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-card">
            <div className="text-sm text-muted-foreground">
              Mostrando {table.getState().pagination.pageIndex * 10 + 1} a{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * 10,
                productos.length,
              )}{" "}
              de {productos.length} productos
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-24"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-24"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
