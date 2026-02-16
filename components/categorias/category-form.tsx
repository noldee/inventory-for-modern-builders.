"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriasAPI } from "@/lib/api";
import { toast } from "sonner";
import { IconDeviceFloppy, IconLoader2, IconTag } from "@tabler/icons-react";

const categorySchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  descripcion: z.string().max(255, "Máximo 255 caracteres").optional(),
});

export function CategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => categoriasAPI.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría creada con éxito");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-8"
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Nombre de la Categoría
          </Label>
          <Input
            {...register("nombre")}
            placeholder="Ej. Pinturas, Herramientas Eléctricas..."
            className="h-12 bg-muted/30 border-none rounded-xl"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs">
              {errors.nombre.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Descripción
          </Label>
          <Textarea
            {...register("descripcion")}
            placeholder="Breve descripción para organizar mejor..."
            className="bg-muted/30 border-none rounded-xl min-h-[120px]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-12 rounded-xl bg-foreground text-background font-bold shadow-xl"
      >
        {mutation.isPending ? (
          <IconLoader2 className="animate-spin mr-2" />
        ) : (
          <IconDeviceFloppy className="mr-2" />
        )}
        Guardar Categoría
      </Button>
    </form>
  );
}
