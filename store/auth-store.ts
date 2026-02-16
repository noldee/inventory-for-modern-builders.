import { create } from 'zustand';

interface AuthState {
  username: string | null;
  roles: string[];
  isAuthenticated: boolean | null;
  login: (username: string, roles: string[]) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  roles: [],
  isAuthenticated: null,
  
  // ✅ YA NO GUARDAMOS TOKEN (está en httpOnly cookie)
  login: (username, roles) => {
    console.log('✅ [AUTH STORE] Login exitoso');
    console.log('✅ [AUTH STORE] Username:', username);
    console.log('✅ [AUTH STORE] Roles:', roles);
    
    // Guardamos solo username y roles en localStorage (info no sensible)
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username);
      localStorage.setItem('roles', JSON.stringify(roles));
    }
    
    set({ username, roles, isAuthenticated: true });
  },
  
  logout: () => {
    console.log('🔍 [AUTH STORE] Haciendo logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username');
      localStorage.removeItem('roles');
    }
    set({ username: null, roles: [], isAuthenticated: false });
  },
  
  initAuth: async () => {
    console.log('🔍 [AUTH STORE] Verificando autenticación...');
    
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      
      if (username && roles.length > 0) {
        console.log('✅ [AUTH STORE] Usuario encontrado en localStorage');
        set({ username, roles, isAuthenticated: true });
      } else {
        console.log('⚠️ [AUTH STORE] No hay datos de usuario');
        set({ username: null, roles: [], isAuthenticated: false });
      }
    }
  },
}));