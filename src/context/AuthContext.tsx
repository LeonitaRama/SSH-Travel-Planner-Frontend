// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useMemo,
  useCallback,
} from "react";
import api from "../services/api";

interface User {
  id: string;
  email: string;
  username: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";
  tenantId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      if (initialLoadDone.current) return;
      initialLoadDone.current = true;

      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser && !isLoggingOut.current) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        try {
          const response = await api.get("/auth/profile");
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      throw new Error("Tenant not found. Please refresh the page.");
    }

    const response = await api.post(
      "/auth/login",
      { email, password },
      { headers: { "x-tenant-id": tenantId } },
    );

    const { access_token, refresh_token, user } = response.data;

    setToken(access_token);
    setUser(user);
    localStorage.setItem("token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const logout = useCallback(async () => {
    isLoggingOut.current = true;
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore error
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      isLoggingOut.current = false;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    try {
      const response = await api.post("/auth/refresh-token", { refreshToken });
      const { access_token, refresh_token } = response.data;

      setToken(access_token);
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    } catch {
      await logout();
      throw new Error("Refresh failed");
    }
  }, [logout]);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refreshToken }),
    [user, token, loading, login, logout, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
