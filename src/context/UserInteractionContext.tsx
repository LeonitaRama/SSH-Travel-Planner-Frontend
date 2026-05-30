// Menaxhon listat e dëshirave,
// komentet
// dhe
// kuponat
// (/wishlists/*,
// /reviews/*,
// /coupons/*,
// /activities/*).

// Menaxhon listat e dëshirave (wishlists), komentet (reviews), kuponat (coupons) dhe aktivitetet (activities).
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import api from "../services/api";

// =========================================================================
// 1. Tipizimet (Interfaces) bazuar në skemën tuaj të Prisma-s
// =========================================================================
export interface Wishlist {
  id: string;
  tenantId: string;
  userId: string;
  destinationId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  tenantId: string;
  userId: string;
  hotelId: string | null;
  destinationId: string | null;
  rating: number;
  comment: string;
  aiAnalysis: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  tenantId: string;
  destinationId: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

// =========================================================================
// 2. Defino se çfarë do të ofrojë ky Context për Frontend-in
// =========================================================================
interface UserInteractionContextType {
  wishlists: Wishlist[];
  reviews: Review[];
  coupons: Coupon[];
  activities: Activity[];
  loading: boolean;
  error: string | null;

  // WISHLISTS
  fetchWishlists: () => Promise<void>;
  fetchWishlistById: (id: string) => Promise<Wishlist>;
  addDestinationToWishlist: (destinationId: string) => Promise<void>;
  updateWishlistItem: (
    id: string,
    data: globalThis.Partial<Wishlist>,
  ) => Promise<void>;
  removeDestinationFromWishlist: (id: string) => Promise<void>;

  // REVIEWS
  fetchReviews: () => Promise<void>;
  fetchReviewById: (id: string) => Promise<Review>;
  createReview: (data: globalThis.Partial<Review>) => Promise<void>;
  updateReview: (id: string, data: globalThis.Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // COUPONS
  fetchCoupons: () => Promise<void>;
  fetchCouponById: (id: string) => Promise<Coupon>;
  createCoupon: (data: globalThis.Partial<Coupon>) => Promise<void>;
  updateCoupon: (id: string, data: globalThis.Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  // ACTIVITIES
  fetchActivities: () => Promise<void>;
  fetchActivityById: (id: string) => Promise<Activity>;
  createActivity: (data: globalThis.Partial<Activity>) => Promise<void>;
  updateActivity: (
    id: string,
    data: globalThis.Partial<Activity>,
  ) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const UserInteractionContext =
  createContext<UserInteractionContextType | null>(null);

export function UserInteractionProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const msg = err.response?.data?.message || defaultMessage;
    setError(msg);
    setLoading(false);
    throw new Error(msg);
  }, []);

  // =========================================================================
  // WISHLISTS
  // =========================================================================
  const fetchWishlists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Wishlist[]>("/wishlists");
      setWishlists(res.data);
    } catch (err) {
      handleError(err, "Ngarkimi i listës së dëshirave dështoi.");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchWishlistById = useCallback(async (id: string) => {
    const res = await api.get<Wishlist>(`/wishlists/${id}`);
    return res.data;
  }, []);

  const addDestinationToWishlist = useCallback(
    async (destinationId: string) => {
      setLoading(true);
      try {
        const res = await api.post<Wishlist>("/wishlists", { destinationId });
        setWishlists((prev) => [res.data, ...prev]);
      } catch (err) {
        handleError(err, "Shtimi i destinacionit në listë dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const updateWishlistItem = useCallback(
    async (id: string, data: globalThis.Partial<Wishlist>) => {
      setLoading(true);
      try {
        const res = await api.patch<Wishlist>(`/wishlists/${id}`, data);
        setWishlists((prev) =>
          prev.map((item) => (item.id === id ? res.data : item)),
        );
      } catch (err) {
        handleError(err, "Përditësimi i listës dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const removeDestinationFromWishlist = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.delete(`/wishlists/${id}`);
        setWishlists((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        handleError(err, "Heqja e destinacionit nga lista dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // =========================================================================
  // REVIEWS
  // =========================================================================
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Review[]>("/reviews");
      setReviews(res.data);
    } catch (err) {
      handleError(err, "Ngarkimi i komenteve dështoi.");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchReviewById = useCallback(async (id: string) => {
    const res = await api.get<Review>(`/reviews/${id}`);
    return res.data;
  }, []);

  const createReview = useCallback(
    async (data: globalThis.Partial<Review>) => {
      setLoading(true);
      try {
        const res = await api.post<Review>("/reviews", data);
        setReviews((prev) => [res.data, ...prev]);
      } catch (err) {
        handleError(err, "Krijimi i komentit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const updateReview = useCallback(
    async (id: string, data: globalThis.Partial<Review>) => {
      setLoading(true);
      try {
        const res = await api.patch<Review>(`/reviews/${id}`, data);
        setReviews((prev) =>
          prev.map((item) => (item.id === id ? res.data : item)),
        );
      } catch (err) {
        handleError(err, "Përditësimi i komentit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const deleteReview = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.delete(`/reviews/${id}`);
        setReviews((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        handleError(err, "Fshirja e komentit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // =========================================================================
  // COUPONS
  // =========================================================================
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Coupon[]>("/coupons");
      setCoupons(res.data);
    } catch (err) {
      handleError(err, "Ngarkimi i kuponave dështoi.");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchCouponById = useCallback(async (id: string) => {
    const res = await api.get<Coupon>(`/coupons/${id}`);
    return res.data;
  }, []);

  const createCoupon = useCallback(
    async (data: globalThis.Partial<Coupon>) => {
      setLoading(true);
      try {
        const res = await api.post<Coupon>("/coupons", data);
        setCoupons((prev) => [res.data, ...prev]);
      } catch (err) {
        handleError(err, "Krijimi i kuponit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const updateCoupon = useCallback(
    async (id: string, data: globalThis.Partial<Coupon>) => {
      setLoading(true);
      try {
        const res = await api.patch<Coupon>(`/coupons/${id}`, data);
        setCoupons((prev) =>
          prev.map((item) => (item.id === id ? res.data : item)),
        );
      } catch (err) {
        handleError(err, "Përditësimi i kuponit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const deleteCoupon = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.delete(`/coupons/${id}`);
        setCoupons((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        handleError(err, "Fshirja e kuponit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // =========================================================================
  // ACTIVITIES
  // =========================================================================
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Activity[]>("/activities");
      setActivities(res.data);
    } catch (err) {
      handleError(err, "Ngarkimi i aktiviteteve dështoi.");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchActivityById = useCallback(async (id: string) => {
    const res = await api.get<Activity>(`/activities/${id}`);
    return res.data;
  }, []);

  const createActivity = useCallback(
    async (data: globalThis.Partial<Activity>) => {
      setLoading(true);
      try {
        const res = await api.post<Activity>("/activities", data);
        setActivities((prev) => [res.data, ...prev]);
      } catch (err) {
        handleError(err, "Krijimi i aktivitetit dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const updateActivity = useCallback(
    async (id: string, data: globalThis.Partial<Activity>) => {
      setLoading(true);
      try {
        const res = await api.patch(`/activities/${id}`, data);
        setActivities((prev) =>
          prev.map((item) => (item.id === id ? res.data : item)),
        );
      } catch (err) {
        handleError(err, "Përditësimi i aktiviteti dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.delete(`/activities/${id}`);
        setActivities((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        handleError(err, "Fshirja e aktiviteti dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // =========================================================================
  // // 3. Otimizimi i Vlerave (useMemo)
  // // =========================================================================
  const value = useMemo(
    () => ({
      wishlists,
      reviews,
      coupons,
      activities,
      loading,
      error,
      fetchWishlists,
      fetchWishlistById,
      addDestinationToWishlist,
      updateWishlistItem,
      removeDestinationFromWishlist,
      fetchReviews,
      fetchReviewById,
      createReview,
      updateReview,
      deleteReview,
      fetchCoupons,
      fetchCouponById,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      fetchActivities,
      fetchActivityById,
      createActivity,
      updateActivity,
      deleteActivity,
    }),
    [
      wishlists,
      reviews,
      coupons,
      activities,
      loading,
      error,
      fetchWishlists,
      fetchWishlistById,
      addDestinationToWishlist,
      updateWishlistItem,
      removeDestinationFromWishlist,
      fetchReviews,
      fetchReviewById,
      createReview,
      updateReview,
      deleteReview,
      fetchCoupons,
      fetchCouponById,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      fetchActivities,
      fetchActivityById,
      createActivity,
      updateActivity,
      deleteActivity,
    ],
  );
  return (
    <UserInteractionContext.Provider value={value}>
      {children}
    </UserInteractionContext.Provider>
  );
}
export function useUserInteraction() {
  const context = useContext(UserInteractionContext);
  if (!context)
    throw new Error(
      "useUserInteraction must be used inside UserInteractionProvider",
    );
  return context;
}
