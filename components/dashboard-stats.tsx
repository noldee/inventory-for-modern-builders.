"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Ventas Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$1,250</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$18,430</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">320</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">145</p>
        </CardContent>
      </Card>
    </div>
  );
}
