import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ CRÍTICO: Enviar cookies automáticamente
});

// ✅ YA NO NECESITAMOS INTERCEPTOR DE REQUEST (la cookie se envía sola)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.error("❌ No autenticado, redirigiendo a login");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.error("❌ No tienes permisos para esta acción");
    }

    return Promise.reject(error);
  },
);

// Tipos (sin cambios)
export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  ubicacion: string;
  categoria: { id: number; nombre?: string };
  proveedor: { id: number; nombre?: string };
  activo: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  productos?: any[];
}
export type CategoriaCreate = Omit<Categoria, "id">;

export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface MovimientoInventario {
  id: number;
  producto: { id: number };
  tipo: "ENTRADA" | "SALIDA" | "AJUSTE";
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  usuario: string;
  fechaMovimiento: string;
}

export type ProductoCreate = Omit<Producto, "id">;

// API Functions
export const authAPI = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
  registro: (data: any) => api.post("/auth/registro", data),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/check"), // ✅ NUEVO
};

export const productosAPI = {
  getAll: () => api.get<Producto[]>("/productos"),
  getById: (id: number) => api.get<Producto>(`/productos/${id}`),
  getActivos: () => api.get<Producto[]>("/productos/activos"),
  getStockBajo: () => api.get<Producto[]>("/productos/stock-bajo"),
  buscar: (nombre: string) =>
    api.get<Producto[]>(`/productos/buscar?nombre=${nombre}`),
  crear: (data: any) => api.post<Producto>("/productos", data),
  actualizar: (id: number, data: any) =>
    api.put<Producto>(`/productos/${id}`, data),
  ajustarStock: (id: number, data: any) =>
    api.patch(`/productos/${id}/stock`, data),
  eliminar: (id: number) => api.delete(`/productos/${id}`),
};

export const categoriasAPI = {
  getAll: async (): Promise<Categoria[]> => {
    const res = await api.get("/categorias");

    // Si backend devuelve array directo
    if (Array.isArray(res.data)) {
      return res.data as Categoria[];
    }

    // Si backend devuelve Pageable (Spring)
    if (Array.isArray(res.data?.content)) {
      return res.data.content as Categoria[];
    }

    return [];
  },

  getById: async (id: number): Promise<Categoria> => {
    const res = await api.get(`/categorias/${id}`);
    return res.data;
  },

  crear: async (data: CategoriaCreate): Promise<Categoria> => {
    const res = await api.post("/categorias", data);
    return res.data;
  },

  actualizar: async (id: number, data: CategoriaCreate): Promise<Categoria> => {
    const res = await api.put(`/categorias/${id}`, data);
    return res.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};

export const proveedoresAPI = {
  getAll: async (): Promise<Proveedor[]> => {
    const res = await api.get("/proveedores");

    // Si backend devuelve array directo
    if (Array.isArray(res.data)) {
      return res.data;
    }

    // Si backend devuelve Spring Pageable
    if (Array.isArray(res.data.content)) {
      return res.data.content;
    }

    return [];
  },
  getById: (id: number) => api.get<Proveedor>(`/proveedores/${id}`),
  crear: (data: Proveedor) => api.post<Proveedor>("/proveedores", data),
  actualizar: (id: number, data: Proveedor) =>
    api.put<Proveedor>(`/proveedores/${id}`, data),
  eliminar: (id: number) => api.delete(`/proveedores/${id}`),
};

export const movimientosAPI = {
  getAll: () => api.get<MovimientoInventario[]>("/movimientos"),
  getByProducto: (productoId: number) =>
    api.get<MovimientoInventario[]>(`/movimientos/producto/${productoId}`),
};
