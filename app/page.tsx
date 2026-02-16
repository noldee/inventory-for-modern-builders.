"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Box,
  Zap,
  Shield,
  Code2,
  Package,
  Trash2,
  Plus,
  Github,
  Twitter,
  Layers,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, ease: "easeOut" },
};

const companies = [
  "LA ECONOMICA",
  "Valentina",
  "REMUZGO",
  "Ferropolis",
  "Jireh",
  "Provinsur",
];

export default function HomePage() {
  const { setTheme } = useTheme();
  const { isAuthenticated, initAuth } = useAuthStore(); // ✅ Obtener initAuth
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Martillo Galponero",
      stock: 15,
      price: 12.5,
      sku: "MART-001",
    },
    { id: 2, name: "Taladro Percutor", stock: 8, price: 85.0, sku: "TAL-002" },
  ]);
  const [newProduct, setNewProduct] = useState("");

  // ✅ INICIALIZAR AUTH AL MONTAR EL COMPONENTE
  useEffect(() => {
    setMounted(true);
    initAuth(); // ← ESTO ES LO QUE FALTABA
  }, [initAuth]);

  const addProduct = () => {
    if (items.length >= 5 || !newProduct.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newProduct,
        stock: Math.floor(Math.random() * 50) + 1,
        price: Math.random() * 100 + 10,
        sku: `SKU-${Math.floor(Math.random() * 1000)}`,
      },
    ]);
    setNewProduct("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-foreground selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      {/* --- NAVBAR MEJORADO --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold tracking-tighter text-xl"
            >
              <Layers className="size-6 text-primary" />
              <span>Ferretería</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#demo"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Live Demo
              </Link>
              <Link
                href="/api-docs"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                API Docs
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full border border-border/40"
                >
                  <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-[#000000] border-border/40 font-medium"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                // ✅ Si está logueado, mostrar Dashboard
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="h-9 px-5 font-bold rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                // ✅ Si NO está logueado, mostrar Login y Get Started
                <>
                  <Link
                    href="/login"
                    className="hidden sm:flex text-sm font-semibold hover:text-primary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link href="/registro">
                    <Button
                      size="sm"
                      className="h-9 px-5 font-bold rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-6">
        {/* --- HERO SECTION --- */}
        <section className="pt-12 pb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: "easeOut" as const,
            }}
          >
            <Badge
              variant="outline"
              className="mb-8 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-black border-border/80 rounded-full bg-muted/30"
            >
              New: Enterprise Dashboard 1.0
            </Badge>
            <h1 className="text-6xl md:text-[92px] font-bold tracking-tight mb-8 leading-[0.95] bg-gradient-to-b from-black to-neutral-500 dark:from-white dark:to-neutral-600 bg-clip-text text-transparent">
              Inventory for <br /> modern builders.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[650px] mx-auto mb-10 tracking-tight leading-relaxed">
              La plataforma definitiva para gestionar stock con la velocidad de
              Next.js y la robustez de Java Spring Boot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-full h-12 px-10 font-bold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all shadow-lg hover:shadow-neutral-500/20 active:scale-95"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="rounded-full h-12 px-10 font-bold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all shadow-lg hover:shadow-neutral-500/20 active:scale-95"
                    >
                      Start building
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                  <Link href="https://github.com/noldee" target="_blank">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-12 px-10 font-bold border-border/80 hover:bg-muted/50 transition-all active:scale-95"
                    >
                      Documentation
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* --- TRUSTED BY --- */}
        <section className="py-10 border-y border-border/40">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
            {companies.map((c) => (
              <span key={c} className="text-xl font-bold tracking-tighter">
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* --- LIVE DEMO --- */}
        <section id="demo" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Live Demo
            </h2>
            <p className="text-muted-foreground">
              Explora la interfaz profesional que potenciará tu negocio.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 to-neutral-400 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative border border-border/60 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-[#000000]">
              <img
                src="/demo-preview.jpeg"
                alt="Dashboard Preview"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* --- QUICK INTERFACE --- */}
        <section className="py-24 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              Quick Actions
            </h2>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Name..."
                className="h-10 bg-muted/10 border-border/60 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-1"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProduct()}
              />
              <Button
                onClick={addProduct}
                className="h-10 px-6 rounded-lg font-bold"
              >
                Add Item
              </Button>
            </div>
          </div>

          <div className="border border-border/40 rounded-xl overflow-hidden bg-white dark:bg-[#000000]">
            <table className="w-full text-sm">
              <thead className="border-b border-border/40 bg-muted/5">
                <tr>
                  <th className="h-12 px-6 text-left font-bold text-muted-foreground">
                    Product
                  </th>
                  <th className="h-12 px-6 text-center font-bold text-muted-foreground hidden sm:table-cell">
                    SKU
                  </th>
                  <th className="h-12 px-6 text-center font-bold text-muted-foreground">
                    Stock
                  </th>
                  <th className="h-12 px-6 text-right font-bold text-muted-foreground">
                    Price
                  </th>
                  <th className="h-12 px-6 w-[80px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-muted/5 transition-colors group"
                    >
                      <td className="p-6 align-middle font-bold tracking-tight">
                        <div className="flex items-center gap-3">
                          <Package className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          {item.name}
                        </div>
                      </td>
                      <td className="p-6 text-center align-middle font-mono text-xs text-muted-foreground hidden sm:table-cell tracking-widest uppercase">
                        {item.sku}
                      </td>
                      <td className="p-6 text-center align-middle">
                        <Badge
                          variant="outline"
                          className="font-mono px-3 border-border/60"
                        >
                          {item.stock}
                        </Badge>
                      </td>
                      <td className="p-6 text-right align-middle font-mono font-bold">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="p-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-destructive/10 hover:text-destructive transition-all"
                          onClick={() =>
                            setItems(items.filter((i) => i.id !== item.id))
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border/40 py-20 bg-muted/5">
        <div className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter uppercase">
              <Layers className="size-6 text-primary" /> Ferretería
            </div>
            <p className="text-muted-foreground max-w-sm text-sm font-medium">
              Sistemas inteligentes para el comercio tradicional. Elevando la
              eficiencia mediante tecnología de punta.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border/40"
              >
                <Github className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border/40"
              >
                <Twitter className="size-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-4 text-sm font-medium">
            <p className="font-bold text-foreground">Resources</p>
            <p className="text-muted-foreground hover:text-foreground cursor-pointer">
              Documentation
            </p>
            <p className="text-muted-foreground hover:text-foreground cursor-pointer">
              API Reference
            </p>
          </div>
          <div className="space-y-4 text-sm font-medium">
            <p className="font-bold text-foreground">Legal</p>
            <p className="text-muted-foreground hover:text-foreground cursor-pointer">
              Privacy Policy
            </p>
            <p className="text-muted-foreground hover:text-foreground cursor-pointer">
              Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
