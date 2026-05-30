// context/DestinationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import api from "../services/api";

export interface Destination {
  id: string;
  tenantId: string;
  name: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface DestinationContextType {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  fetchDestinations: () => Promise<void>;
  fetchDestinationById: (id: string) => Promise<Destination>;
  createDestination: (data: Partial<Destination>) => Promise<void>;
  updateDestination: (id: string, data: Partial<Destination>) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  fetchHotelsByDestination: (id: string) => Promise<any[]>;
  fetchFlightsByDestination: (id: string) => Promise<any[]>;
}

const DestinationContext = createContext<DestinationContextType | null>(null);

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any, defaultMsg: string) => {
    const msg = err.response?.data?.message || defaultMsg;
    setError(msg);
    setLoading(false);
    throw new Error(msg);
  }, []);

  // ========== CRUD për Destinacionet ==========
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Destination[]>("/destinations");
      setDestinations(res.data);
    } catch (err) {
      handleError(err, "Failed to load destinations");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchDestinationById = useCallback(async (id: string) => {
    const res = await api.get<Destination>(`/destinations/${id}`);
    return res.data;
  }, []);

  const createDestination = useCallback(
    async (data: Partial<Destination>) => {
      setLoading(true);
      try {
        const res = await api.post<Destination>("/destinations", data);
        setDestinations((prev) => [res.data, ...prev]);
      } catch (err) {
        handleError(err, "Failed to create destination");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const updateDestination = useCallback(
    async (id: string, data: Partial<Destination>) => {
      setLoading(true);
      try {
        const res = await api.patch<Destination>(`/destinations/${id}`, data);
        setDestinations((prev) =>
          prev.map((d) => (d.id === id ? res.data : d)),
        );
      } catch (err) {
        handleError(err, "Failed to update destination");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const deleteDestination = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.delete(`/destinations/${id}`);
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        handleError(err, "Failed to delete destination");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // ========== Të dhëna të lidhura me destinacionin ==========
  const fetchHotelsByDestination = useCallback(async (id: string) => {
    const res = await api.get(`/destinations/${id}/hotels`);
    return res.data;
  }, []);

  const fetchFlightsByDestination = useCallback(async (id: string) => {
    const res = await api.get(`/destinations/${id}/flights`);
    return res.data;
  }, []);

  const value = useMemo(
    () => ({
      destinations,
      loading,
      error,
      fetchDestinations,
      fetchDestinationById,
      createDestination,
      updateDestination,
      deleteDestination,
      fetchHotelsByDestination,
      fetchFlightsByDestination,
    }),
    [
      destinations,
      loading,
      error,
      fetchDestinations,
      fetchDestinationById,
      createDestination,
      updateDestination,
      deleteDestination,
      fetchHotelsByDestination,
      fetchFlightsByDestination,
    ],
  );

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestination must be used within DestinationProvider");
  }
  return context;
}
