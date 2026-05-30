// hooks/useCrud.ts
import { useState, useEffect, useCallback } from "react";
import { BaseCrudService } from "../services/BaseCrudService";

export function useCrud<T, CreateDto, UpdateDto>(
  endpoint: string,
  options?: { autoFetch?: boolean },
) {
  const service = new BaseCrudService<T, CreateDto, UpdateDto>(endpoint);
  const [data, setData] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.findAll();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const fetchOne = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.findOne(id);
        setSelectedItem(result);
        return result;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch item");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const create = useCallback(
    async (data: CreateDto) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.create(data);
        await fetchAll();
        return result;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchAll],
  );

  const update = useCallback(
    async (id: string, data: UpdateDto) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.update(id, data);
        await fetchAll();
        return result;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchAll],
  );

  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await service.delete(id);
        await fetchAll();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchAll],
  );

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchAll();
    }
  }, []);

  return {
    data,
    selectedItem,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    setSelectedItem,
  };
}
