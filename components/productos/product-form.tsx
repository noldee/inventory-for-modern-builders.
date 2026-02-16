"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  productosAPI,
  categoriasAPI,
  proveedoresAPI,
  Producto,
  Categoria,
  Proveedor,
} from "@/lib/api";
import { toast } from "sonner";
import {
  IconLoader2,
  IconDeviceFloppy,
  IconMapPin,
  IconNotes,
  IconPackage,
  IconTag,
  IconScale,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Esquema de validación estricto
const productSchema = z.object({
  sku: z.string().min(1, "El SKU es obligatorio"),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().default(""), // Quitamos el .optional() para evitar el undefined
  precioCompra: z.coerce.number().min(0),
  precioVenta: z.coerce.number().min(0.01),
  stockActual: z.coerce.number().int().min(0),
  stockMinimo: z.coerce.number().int().min(0),
  unidadMedida: z.string().min(1),
  ubicacion: z.string().default(""), // Quitamos el .optional()
  categoria: z.object({
    id: z.coerce.number().min(1, "Selecciona una categoría"),
  }),
  proveedor: z.object({
    id: z.coerce.number().min(1, "Selecciona un proveedor"),
  }),
  activo: z.boolean().default(true),
});
type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  producto?: Producto;
  onSuccess: () => void;
}

export function ProductForm({ producto, onSuccess }: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!producto;

  // Carga de diccionarios (Categorías y Proveedores)
  const { data: categorias = [] } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: categoriasAPI.getAll,
  });

  const { data: proveedores = [] } = useQuery<Proveedor[]>({
    queryKey: ["proveedores"],
    queryFn: proveedoresAPI.getAll,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      sku: "",
      nombre: "",
      descripcion: "",
      precioCompra: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 5,
      unidadMedida: "unidad",
      ubicacion: "",
      activo: true,
      categoria: { id: 0 }, // Asegúrate de que no sea null
      proveedor: { id: 0 }, // Asegúrate de que no sea null
    },
  });

  // Sincronizar datos cuando el producto cambia (Edición)
  React.useEffect(() => {
    if (producto) {
      reset({
        sku: producto.sku,
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stockActual: producto.stockActual,
        stockMinimo: producto.stockMinimo,
        unidadMedida: producto.unidadMedida,
        ubicacion: producto.ubicacion || "",
        categoria: { id: producto.categoria?.id || 0 },
        proveedor: { id: producto.proveedor?.id || 0 },
        activo: producto.activo ?? true,
      });
    }
  }, [producto, reset]);

  // Observar valores para los Selects controlados
  const categoryValue = watch("categoria.id");
  const providerValue = watch("proveedor.id");
  const unitValue = watch("unidadMedida");

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEditMode && producto?.id
        ? productosAPI.actualizar(producto.id, data)
        : productosAPI.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success(
        isEditMode ? "Producto actualizado" : "Producto creado con éxito",
      );
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al procesar la solicitud",
      );
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-8"
    >
      {/* SECCIÓN 1: IDENTIFICACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
            <IconTag size={16} className="text-primary" /> Nombre del Producto
          </Label>
          <Input
            {...register("nombre")}
            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium"
            placeholder="Ej: Taladro Percutor Inalámbrico 18V"
          />
          {errors.nombre && (
            <p className="text-xs text-red-500 font-bold italic">
              {errors.nombre.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 italic">
            Código SKU
          </Label>
          <Input
            {...register("sku")}
            disabled={isEditMode}
            className="h-11 rounded-xl bg-slate-100 border-slate-200 font-mono tracking-wider"
            placeholder="SKU-000-000"
          />
          {errors.sku && (
            <p className="text-xs text-red-500 font-bold">
              {errors.sku.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 flex items-center gap-1 italic">
            <IconMapPin size={16} /> Ubicación en Almacén
          </Label>
          <Input
            {...register("ubicacion")}
            className="h-11 rounded-xl bg-slate-50 border-slate-200"
            placeholder="Pasillo 4 - Estantería B"
          />
        </div>

        {/* SECCIÓN 2: CATEGORIZACIÓN */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 italic">
            Categoría
          </Label>
          <Select
            value={categoryValue > 0 ? categoryValue.toString() : ""}
            onValueChange={(val) =>
              setValue("categoria.id", Number(val), { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200 shadow-sm">
              <SelectValue placeholder="Seleccionar categoría..." />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoria?.id && (
            <p className="text-[10px] text-red-500 font-black uppercase">
              {errors.categoria.id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 italic">
            Proveedor Principal
          </Label>
          <Select
            value={providerValue > 0 ? providerValue.toString() : ""}
            onValueChange={(val) =>
              setValue("proveedor.id", Number(val), { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200 shadow-sm">
              <SelectValue placeholder="Seleccionar proveedor..." />
            </SelectTrigger>
            <SelectContent>
              {proveedores.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.proveedor?.id && (
            <p className="text-[10px] text-red-500 font-black uppercase">
              {errors.proveedor.id.message}
            </p>
          )}
        </div>

        {/* SECCIÓN 3: UNIDAD Y DESCRIPCIÓN */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 flex items-center gap-1 italic">
            <IconScale size={16} /> Unidad de Medida
          </Label>
          <Select
            value={unitValue}
            onValueChange={(val) =>
              setValue("unidadMedida", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
              <SelectValue placeholder="Unidad..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unidad">Unidad (Un)</SelectItem>
              <SelectItem value="kg">Kilogramos (Kg)</SelectItem>
              <SelectItem value="m">Metros (M)</SelectItem>
              <SelectItem value="lt">Litros (Lt)</SelectItem>
              <SelectItem value="paquete">Paquete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 flex items-center gap-1 italic">
            <IconNotes size={16} /> Notas y Detalles
          </Label>
          <Textarea
            {...register("descripcion")}
            className="rounded-xl bg-slate-50 border-slate-200 min-h-[44px] max-h-[120px]"
            placeholder="Especificaciones técnicas..."
          />
        </div>
      </div>

      {/* SECCIÓN 4: PANEL DE CONTROL DE STOCK Y PRECIOS (Visualmente destacado) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-6 rounded-[2rem] shadow-xl">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
            P. Compra ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            {...register("precioCompra")}
            className="bg-slate-800 border-none text-blue-50 rounded-xl h-11 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
            P. Venta ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            {...register("precioVenta")}
            className="bg-slate-800 border-none text-emerald-400 rounded-xl h-11 font-bold text-lg focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
            <IconPackage size={14} /> Stock Actual
          </Label>
          <Input
            type="number"
            {...register("stockActual")}
            className="bg-slate-800 border-none text-white rounded-xl h-11 focus:ring-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-orange-400 tracking-widest italic">
            Stock Mínimo
          </Label>
          <Input
            type="number"
            {...register("stockMinimo")}
            className="bg-slate-800 border-none text-orange-100 rounded-xl h-11 border-b-2 border-orange-500/50"
          />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-4 justify-end pt-6 border-t border-slate-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onSuccess}
          className="rounded-xl h-12 px-8 font-bold text-slate-500 hover:bg-slate-100 transition-colors"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-xl bg-slate-900 px-10 h-12 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          {mutation.isPending ? (
            <>
              <IconLoader2 className="animate-spin mr-2" size={20} />
              Procesando...
            </>
          ) : (
            <>
              <IconDeviceFloppy className="mr-2" size={20} />
              {isEditMode ? "Guardar Cambios" : "Crear Producto"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
