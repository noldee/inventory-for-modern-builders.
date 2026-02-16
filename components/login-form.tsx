"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Mail } from "lucide-react";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      console.log('🔍 [LOGIN] Iniciando login...');
      
      // ✅ El token se guarda automáticamente en la cookie httpOnly
      const response = await authAPI.login(username, password);
      const { username: user, roles } = response.data;
      
      console.log('✅ [LOGIN] Login exitoso');
      console.log('✅ [LOGIN] Cookie guardada automáticamente');
      
      // Solo guardamos username y roles (NO el token)
      login(user, roles);
      
      toast.success("¡Bienvenido!", {
        description: `Has iniciado sesión como ${user}`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('❌ [LOGIN] Error:', error);
      toast.error("Error al iniciar sesión", {
        description: error.response?.data?.message || "Verifica tus credenciales",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full"
          onClick={() => toast.info("Próximamente", {
            description: "OAuth con GitHub estará disponible pronto"
          })}
        >
          <IconBrandGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full"
          onClick={() => toast.info("Próximamente", {
            description: "OAuth con Google estará disponible pronto"
          })}
        >
          <IconBrandGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continúa con
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Usuario o Email</FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="usuario@correo.com"
              required
              autoComplete="username"
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
              autoComplete="current-password"
              disabled={isLoading}
            />
          </Field>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Iniciar con Email
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}