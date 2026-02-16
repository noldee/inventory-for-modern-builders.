"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proveedoresAPI } from "@/lib/api";
import { toast } from "sonner";
import { IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react";

const providerSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  direccion: z.string().optional(),
});

export function ProviderForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(providerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => proveedoresAPI.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      toast.success("Proveedor registrado");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Razón Social / Nombre
          </Label>
          <Input
            {...register("nombre")}
            placeholder="Ej. Distribuidora Central S.A."
            className="h-12 bg-muted/30 border-none rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Nombre de Contacto
          </Label>
          <Input
            {...register("contacto")}
            placeholder="Ej. Juan Pérez"
            className="h-12 bg-muted/30 border-none rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Teléfono
          </Label>
          <Input
            {...register("telefono")}
            placeholder="+51 999..."
            className="h-12 bg-muted/30 border-none rounded-xl"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Email Corporativo
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder="contacto@proveedor.com"
            className="h-12 bg-muted/30 border-none rounded-xl"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Dirección Física
          </Label>
          <Input
            {...register("direccion")}
            placeholder="Av. Industrial 123, Lima"
            className="h-12 bg-muted/30 border-none rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-12 rounded-xl bg-foreground text-background font-bold shadow-xl transition-transform active:scale-95"
      >
        {mutation.isPending ? (
          <IconLoader2 className="animate-spin mr-2" />
        ) : (
          <IconDeviceFloppy className="mr-2" />
        )}
        Finalizar Registro
      </Button>
    </form>
  );
}
