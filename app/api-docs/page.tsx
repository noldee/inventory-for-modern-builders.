"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Box,
  Code2,
  ExternalLink,
  Lock,
  Globe,
  Zap,
  Terminal,
} from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/auth/login",
    description: "Autenticación de usuario. Retorna un JWT necesario para el resto de las operaciones.",
    tag: "Auth",
    request: `{
  "username": "admin",
  "password": "admin123"
}`,
    response: `{
  "token": "eyJhbGc...",
  "username": "admin",
  "roles": ["ROLE_ADMIN"]
}`,
  },
  {
    method: "GET",
    path: "/api/productos",
    description: "Obtén la lista completa de productos con detalles de stock y precios.",
    tag: "Productos",
    response: `[
  {
    "id": 1,
    "sku": "MART-001",
    "nombre": "Martillo",
    "precioVenta": 25.00,
    "stockActual": 50
  }
]`,
  },
  {
    method: "POST",
    path: "/api/productos",
    description: "Registra un nuevo producto en el sistema. Requiere validación de SKU único.",
    tag: "Productos",
    request: `{
  "sku": "PROD-001",
  "nombre": "Producto",
  "precioVenta": 15.00,
  "stockActual": 100,
  "categoria": { "id": 1 }
}`,
  },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-foreground selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </Link>
            <div className="h-4 w-[1px] bg-border/40 mx-2" />
            <div className="flex items-center gap-2 font-bold tracking-tighter">
              <Box size={18} className="text-primary" />
              <span>API Reference</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden md:flex font-mono text-[10px] uppercase tracking-widest bg-muted/30">
              v1.0.2 - Stable
            </Badge>
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs px-4">
                Swagger UI <ExternalLink size={12} className="ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* --- HEADER --- */}
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-black to-neutral-500 dark:from-white dark:to-neutral-600 bg-clip-text text-transparent">
              Integrate FerreteríaSis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Utiliza nuestra API REST para conectar tu inventario con plataformas de e-commerce, 
              terminales de punto de venta o aplicaciones móviles personalizadas.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- SIDEBAR IZQUIERDO --- */}
          <aside className="lg:col-span-3 hidden lg:block space-y-8 sticky top-28 h-fit">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Introducción</p>
              <nav className="flex flex-col gap-2">
                <Link href="#auth" className="text-sm font-medium hover:text-primary transition-colors">Autenticación</Link>
                <Link href="#endpoints" className="text-sm font-medium hover:text-primary transition-colors">Endpoints</Link>
                <Link href="#errors" className="text-sm font-medium hover:text-primary transition-colors">Códigos de Error</Link>
              </nav>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
              <p className="text-xs font-bold mb-2 flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" /> Base URL
              </p>
              <code className="text-[10px] break-all font-mono opacity-70">http://localhost:8080/api</code>
            </div>
          </aside>

          {/* --- CONTENIDO PRINCIPAL --- */}
          <div className="lg:col-span-9 space-y-24">
            
            {/* Sección Autenticación */}
            <section id="auth" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Autenticación</h2>
              </div>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nuestra API utiliza **JSON Web Tokens (JWT)**. Debes incluir el token en la cabecera 
                    de cada petición para acceder a recursos protegidos.
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border border-border/40 bg-[#0d0d0d] p-4 shadow-2xl">
                   <p className="text-[10px] text-neutral-500 font-mono mb-2 uppercase tracking-widest">Header Example</p>
                   <code className="text-xs text-emerald-400 font-mono">
                    Authorization: Bearer {'<your_token>'}
                   </code>
                </div>
              </div>
            </section>

            {/* Sección Endpoints */}
            <section id="endpoints" className="space-y-16 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Endpoints</h2>
              </div>

              {endpoints.map((endpoint, index) => (
                <div key={index} className="grid lg:grid-cols-2 gap-8 border-t border-border/40 pt-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`font-mono text-[10px] rounded-md ${
                        endpoint.method === "GET" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-bold tracking-tight">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {endpoint.description}
                    </p>
                    <Badge variant="secondary" className="text-[10px] rounded-full px-3">{endpoint.tag}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-border/40 bg-[#0d0d0d] shadow-xl">
                      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-white/5">
                         <div className="flex gap-1.5">
                            <div className="size-2.5 rounded-full bg-red-500/20" />
                            <div className="size-2.5 rounded-full bg-yellow-500/20" />
                            <div className="size-2.5 rounded-full bg-emerald-500/20" />
                         </div>
                         <Terminal size={12} className="text-neutral-500" />
                      </div>
                      
                      <div className="p-4 space-y-6">
                        {endpoint.request && (
                          <div>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase mb-2 tracking-widest">Payload</p>
                            <pre className="text-[11px] text-blue-300 font-mono leading-relaxed overflow-x-auto">
                              <code>{endpoint.request}</code>
                            </pre>
                          </div>
                        )}
                        {endpoint.response && (
                          <div>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase mb-2 tracking-widest">Response</p>
                            <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed overflow-x-auto">
                              <code>{endpoint.response}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      {/* --- FOOTER SIMPLIFICADO --- */}
      <footer className="border-t border-border/40 py-12 bg-muted/5 mt-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Built for scale by FerreteríaSis Team
        </p>
      </footer>
    </div>
  );
}