import { SectionCards } from "@/components/section-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Control</h1>
      <SectionCards />
      <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
        Bienvenido al sistema. Selecciona una opción del menú lateral.
      </div>
    </div>
  );
}