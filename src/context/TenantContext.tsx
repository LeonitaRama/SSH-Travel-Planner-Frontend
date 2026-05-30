// context/TenantContext.tsx
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

export const TenantContext = createContext<TenantContextType | undefined>(
  undefined,
);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);
  const isFetching = useRef(false);

  const fetchTenantMetadata = useCallback(async (slug: string) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Tenant>(
        `http://localhost:3000/tenants/slug/${slug}`,
      );

      setTenant(response.data);
      localStorage.setItem("tenantId", response.data.id);
      localStorage.setItem("tenantSlug", response.data.slug);
    } catch (err) {
      console.error("Error fetching tenant:", err);
      setError(`Agency with slug '${slug}' does not exist.`);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      const pathParts = window.location.pathname.split("/");
      const currentSlug =
        pathParts[1] && pathParts[1].trim() !== "" ? pathParts[1] : "tenant1";
      fetchTenantMetadata(currentSlug);
    }
  }, [fetchTenantMetadata]);

  const refreshTenant = useCallback(async () => {
    const pathParts = window.location.pathname.split("/");
    const currentSlug =
      pathParts[1] && pathParts[1].trim() !== "" ? pathParts[1] : "tenant1";
    await fetchTenantMetadata(currentSlug);
  }, [fetchTenantMetadata]);

  const value = useMemo(
    () => ({ tenant, loading, error, refreshTenant }),
    [tenant, loading, error, refreshTenant],
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}
