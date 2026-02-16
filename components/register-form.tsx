"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authAPI } from "@/lib/api";
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ROLE_USER");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nombreCompleto = formData.get("nombreCompleto") as string;

    try {
      await authAPI.registro({
        username: username,
        email: email,
        password: password,
        nombreCompleto: nombreCompleto,
        roles: [selectedRole],
      });

      toast.success("¡Cuenta creada exitosamente!", {
        description: "Ya puedes iniciar sesión con tus credenciales.",
        duration: 5000,
      });

      setIsSuccess(true);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Error al crear cuenta.";

      toast.error("Error al crear cuenta", {
        description: errorMsg,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center p-6">
        <div className="bg-green-100 dark:bg-green-950 p-3 rounded-full">
          <CheckCircle2 className="size-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold">¡Cuenta creada!</h2>
        <p className="text-muted-foreground text-sm">
          Tu registro fue exitoso. Ya puedes entrar al sistema.
        </p>
        <Link href="/login" className="w-full">
          <Button className="w-full">Ir a Iniciar Sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O regístrate con email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nombreCompleto">Nombre Completo</FieldLabel>
            <Input
              id="nombreCompleto"
              name="nombreCompleto"
              placeholder="Juan Pérez"
              required
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="username">Usuario</FieldLabel>
            <Input
              id="username"
              name="username"
              placeholder="juanperez"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="juan@correo.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel>Tipo de Usuario</FieldLabel>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROLE_USER">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Usuario</span>
                    <span className="text-xs text-muted-foreground">
                      Puede ver y gestionar productos
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="ROLE_ADMIN">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Administrador</span>
                    <span className="text-xs text-muted-foreground">
                      Acceso total al sistema
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Crear cuenta
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
