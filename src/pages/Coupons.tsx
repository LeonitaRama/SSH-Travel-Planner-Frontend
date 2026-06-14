// pages/Coupons.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  description: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount?: number;
  minSpend?: number;
  applicableTo?: string[]; // p.sh. ["flights", "hotels"]
  createdAt: string;
}

function Coupons() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "discount">(
    "newest",
  );
  const [token, setToken] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: 10,
    description: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
    minSpend: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole") || "CUSTOMER";
    setToken(storedToken);
    setUserRole(storedRole);
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<Coupon[]>("/coupons", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });
      if (response.data && response.data.length > 0) {
        setCoupons(response.data);
      } else {
        setCoupons(getDemoCoupons());
      }
    } catch (err: any) {
      console.error("Error fetching coupons:", err);
      setCoupons(getDemoCoupons());
      if (err.response?.status === 401)
        setError("Please login to view coupons");
    } finally {
      setLoading(false);
    }
  };

  const getDemoCoupons = (): Coupon[] => [
    {
      id: "1",
      code: "WELCOME10",
      discountPercentage: 10,
      description: "10% off your first booking",
      validFrom: "2025-01-01T00:00:00Z",
      validUntil: "2025-12-31T23:59:59Z",
      isActive: true,
      usageLimit: 100,
      usedCount: 45,
      minSpend: 100,
      applicableTo: ["flights", "hotels"],
      createdAt: "2025-01-01T00:00:00Z",
    },
    {
      id: "2",
      code: "FLIGHT20",
      discountPercentage: 20,
      description: "20% off all flights",
      validFrom: "2025-03-01T00:00:00Z",
      validUntil: "2025-08-31T23:59:59Z",
      isActive: true,
      usageLimit: 50,
      usedCount: 12,
      minSpend: 200,
      applicableTo: ["flights"],
      createdAt: "2025-03-01T00:00:00Z",
    },
    {
      id: "3",
      code: "HOTEL15",
      discountPercentage: 15,
      description: "15% off hotel bookings over $150",
      validFrom: "2025-02-01T00:00:00Z",
      validUntil: "2025-09-30T23:59:59Z",
      isActive: true,
      usageLimit: 200,
      usedCount: 78,
      minSpend: 150,
      applicableTo: ["hotels"],
      createdAt: "2025-02-01T00:00:00Z",
    },
    {
      id: "4",
      code: "SUMMER25",
      discountPercentage: 25,
      description: "Summer sale - 25% off packages",
      validFrom: "2025-06-01T00:00:00Z",
      validUntil: "2025-08-31T23:59:59Z",
      isActive: true,
      usageLimit: 300,
      usedCount: 210,
      applicableTo: ["travel-packages"],
      createdAt: "2025-06-01T00:00:00Z",
    },
  ];

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.description) {
      setError("Please fill code and description");
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post("/coupons", newCoupon, {
        headers: {
          Authorization: `Bearer ${token}`,
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });
      setCoupons([response.data, ...coupons]);
      setShowAddCoupon(false);
      setNewCoupon({
        code: "",
        discountPercentage: 10,
        description: "",
        validFrom: "",
        validUntil: "",
        isActive: true,
        minSpend: 0,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const filteredCoupons = coupons.filter((c) => {
    if (filter === "all") return true;
    const now = new Date();
    const validUntil = new Date(c.validUntil);
    if (filter === "active") return c.isActive && validUntil > now;
    if (filter === "expired") return !c.isActive || validUntil <= now;
    return true;
  });

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "discount")
      return b.discountPercentage - a.discountPercentage;
    return 0;
  });

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>🏷️</div>
          <h2>Loading coupons...</h2>
        </div>
      </div>
    );

  const canManage = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "40px 20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "64px" }}>🏷️</div>
          <h1 style={{ fontSize: "42px", color: "#2c3e50" }}>
            Coupons & Discounts
          </h1>
          <p>Save on your next adventure</p>
        </div>

        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: 12,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            ⚠️ {error}
          </div>
        )}
        {!token && (
          <div
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: 12,
              borderRadius: 12,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            ⚠️ Login to see real coupons and claim offers.
          </div>
        )}

        <div
          style={{
            background: "white",
            borderRadius: 25,
            padding: 30,
            marginBottom: 30,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 15,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                background: filter === "all" ? "#4facfe" : "white",
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                background: filter === "active" ? "#4facfe" : "white",
              }}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("expired")}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                background: filter === "expired" ? "#4facfe" : "white",
              }}
            >
              Expired
            </button>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ padding: 6, borderRadius: 20 }}
            >
              <option value='newest'>Newest</option>
              <option value='oldest'>Oldest</option>
              <option value='discount'>Biggest Discount</option>
            </select>
          </div>
          {canManage && (
            <button
              onClick={() => setShowAddCoupon(true)}
              style={{
                background: "#4facfe",
                color: "white",
                border: "none",
                borderRadius: 30,
                padding: "8px 20px",
              }}
            >
              + Add Coupon
            </button>
          )}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {sortedCoupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => {
                setSelectedCoupon(coupon);
                setShowModal(true);
              }}
              style={{
                background: "white",
                borderRadius: 20,
                padding: 20,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{coupon.code}</h3>
                  <p>{coupon.description}</p>
                  <div style={{ display: "flex", gap: 15, marginTop: 8 }}>
                    <span>🔖 {coupon.discountPercentage}% OFF</span>
                    <span>📅 Valid until {formatDate(coupon.validUntil)}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background:
                        coupon.isActive &&
                        new Date(coupon.validUntil) > new Date()
                          ? "#d4edda"
                          : "#f8d7da",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {coupon.isActive && new Date(coupon.validUntil) > new Date()
                      ? "Active"
                      : "Expired"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal detaje */}
      {showModal && selectedCoupon && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 25,
              padding: 30,
              maxWidth: 500,
              width: "100%",
            }}
          >
            <h2>{selectedCoupon.code}</h2>
            <p>{selectedCoupon.description}</p>
            <p>💸 {selectedCoupon.discountPercentage}% discount</p>
            <p>
              📅 Valid from {formatDate(selectedCoupon.validFrom)} to{" "}
              {formatDate(selectedCoupon.validUntil)}
            </p>
            {selectedCoupon.minSpend && (
              <p>💰 Minimum spend: ${selectedCoupon.minSpend}</p>
            )}
            {selectedCoupon.usageLimit && (
              <p>
                🎟️ Used {selectedCoupon.usedCount || 0}/
                {selectedCoupon.usageLimit} times
              </p>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: 20,
                background: "#4facfe",
                color: "white",
                border: "none",
                borderRadius: 30,
                padding: "10px 20px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal shtimi (vetem admin) */}
      {showAddCoupon && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 25,
              padding: 30,
              width: 500,
            }}
          >
            <h2>Add New Coupon</h2>
            <input
              placeholder='Code'
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
              style={{
                width: "100%",
                padding: 10,
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: 12,
              }}
            />
            <textarea
              placeholder='Description'
              value={newCoupon.description}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, description: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: 12,
              }}
            />
            <input
              type='number'
              placeholder='Discount %'
              value={newCoupon.discountPercentage}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  discountPercentage: +e.target.value,
                })
              }
              style={{ width: "100%", padding: 10, margin: "10px 0" }}
            />
            <input
              type='datetime-local'
              value={newCoupon.validFrom}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, validFrom: e.target.value })
              }
              style={{ width: "100%", padding: 10, margin: "10px 0" }}
            />
            <input
              type='datetime-local'
              value={newCoupon.validUntil}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, validUntil: e.target.value })
              }
              style={{ width: "100%", padding: 10, margin: "10px 0" }}
            />
            <button
              onClick={handleAddCoupon}
              disabled={submitting}
              style={{
                background: "#4facfe",
                color: "white",
                border: "none",
                padding: 10,
                borderRadius: 30,
                width: "100%",
              }}
            >
              {submitting ? "Adding..." : "Add Coupon"}
            </button>
            <button
              onClick={() => setShowAddCoupon(false)}
              style={{
                marginTop: 10,
                background: "#ccc",
                width: "100%",
                padding: 10,
                borderRadius: 30,
                border: "none",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;
