import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

// Importo të gjitha fotot (për fallback nëse backend nuk kthen foto)
import ParisImg from "../assets/paris (2).jpg";
import RomeImg from "../assets/rome.jpg";
import LondonImg from "../assets/london.jpg";
import TokyoImg from "../assets/Tokyo.jpg";
import BaliImg from "../assets/Bali.jpg";
import DubaiImg from "../assets/dubai.jpg";
import NewYorkImg from "../assets/NewYork.jpg";
import SingaporeMarinaBay from "../assets/singapore marina bay.jpg";

interface BookingItem {
  id: string;
  type: string;
  title: string;
  destination: string;
  image?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  price: number;
  status: "confirmed" | "pending" | "cancelled" | "deleted";
  quantity?: number;
  description?: string;
  bookingId?: string;
  createdAt?: string;
  updatedAt?: string;
}

function BookingItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "pending" | "cancelled" | "deleted"
  >("all");
  const [selectedItem, setSelectedItem] = useState<BookingItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // State për modal-in e konfirmimit
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Merr token-in nga localStorage për autentikim
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch booking items nga backend
  const fetchBookingItems = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<BookingItem[]>("/booking-items", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setItems(response.data);
      } else {
        setItems(getDemoData());
      }
    } catch (err: any) {
      console.error("Error fetching booking items:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your bookings");
      } else if (err.response?.status === 404) {
        setError("Booking items endpoint not found");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load booking items");
      }

      setItems(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  // Demo data për fallback
  const getDemoData = (): BookingItem[] => {
    return [
      {
        id: "1",
        type: "flight",
        title: "Flight to Paris",
        destination: "Paris, France",
        image: ParisImg,
        date: "2024-06-15",
        price: 599,
        status: "confirmed",
        description: "Direct flight from JFK to CDG | Flight AF 123",
      },
      {
        id: "2",
        type: "hotel",
        title: "Grand Hotel Rome",
        destination: "Rome, Italy",
        image: RomeImg,
        checkIn: "2024-07-01",
        checkOut: "2024-07-07",
        price: 1200,
        status: "confirmed",
        description: "Luxury 5-star hotel in city center | Includes breakfast",
      },
      {
        id: "3",
        type: "package",
        title: "Bali Adventure",
        destination: "Bali, Indonesia",
        image: BaliImg,
        date: "2024-08-10",
        price: 1899,
        status: "pending",
        description: "Complete travel package including flights and hotels",
      },
      {
        id: "4",
        type: "flight",
        title: "Flight to Tokyo",
        destination: "Tokyo, Japan",
        image: TokyoImg,
        date: "2024-09-05",
        price: 899,
        status: "cancelled",
        description: "Direct flight with premium economy | Flight NH 456",
      },
      {
        id: "5",
        type: "hotel",
        title: "Marina Bay Sands",
        destination: "Singapore",
        image: SingaporeMarinaBay,
        checkIn: "2024-10-15",
        checkOut: "2024-10-20",
        price: 2500,
        status: "pending",
        description: "Iconic hotel with infinity pool | 5 nights stay",
      },
      {
        id: "6",
        type: "flight",
        title: "Flight to London",
        destination: "London, UK",
        image: LondonImg,
        date: "2024-11-01",
        price: 749,
        status: "pending",
        description: "Direct flight with British Airways",
      },
      {
        id: "7",
        type: "hotel",
        title: "Burj Al Arab",
        destination: "Dubai, UAE",
        image: DubaiImg,
        checkIn: "2024-12-01",
        checkOut: "2024-12-07",
        price: 3500,
        status: "pending",
        description: "7-star luxury hotel | Includes private beach access",
      },
      {
        id: "8",
        type: "flight",
        title: "Flight to New York",
        destination: "New York, USA",
        image: NewYorkImg,
        date: "2024-12-15",
        price: 699,
        status: "confirmed",
        description: "Direct flight with Delta Airlines",
      },
    ];
  };

  // Funksioni për konfirmimin e rezervimit (PATCH)
  const handleConfirmBooking = async (id: string) => {
    setActionLoading(id);
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "confirmed" } : item,
          ),
        );
        alert("✅ Booking confirmed successfully!");
      } else {
        await api.patch(
          `/booking-items/${id}`,
          { status: "confirmed" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "confirmed" } : item,
          ),
        );
        alert("✅ Booking confirmed successfully!");
      }
    } catch (err: any) {
      console.error("Error confirming booking:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to confirm booking. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Funksioni për anulimin e rezervimit - Hap modal konfirmimi
  const handleCancelClick = (id: string) => {
    setConfirmAction({ type: "cancel", id });
    setShowConfirmModal(true);
  };

  // Funksioni për fshirjen e rezervimit - Hap modal konfirmimi
  const handleDeleteClick = (id: string) => {
    setConfirmAction({ type: "delete", id });
    setShowConfirmModal(true);
  };

  // Funksioni për konfirmimin e anulimit
  const confirmCancel = async () => {
    if (!confirmAction) return;
    const { id } = confirmAction;

    setActionLoading(id);
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "cancelled" } : item,
          ),
        );
        alert("✅ Booking cancelled successfully!");
      } else {
        await api.patch(
          `/booking-items/${id}`,
          { status: "cancelled" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "cancelled" } : item,
          ),
        );
        alert("✅ Booking cancelled successfully!");
      }
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to cancel booking. Please try again.",
      );
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Funksioni për konfirmimin e fshirjes
  const confirmDelete = async () => {
    if (!confirmAction) return;
    const { id } = confirmAction;

    setActionLoading(id);
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "deleted" } : item,
          ),
        );
        alert("🗑️ Booking moved to deleted!");
      } else {
        await api.patch(
          `/booking-items/${id}`,
          { status: "deleted" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "deleted" } : item,
          ),
        );
        alert("🗑️ Booking moved to deleted!");
      }
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to delete booking. Please try again.",
      );
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Funksioni për rifillimin e rezervimit (nga cancelled në pending)
  const handleReactivateBooking = async (id: string) => {
    setActionLoading(id);
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "pending" } : item,
          ),
        );
        alert("✅ Booking reactivated! Please confirm your booking.");
      } else {
        await api.patch(
          `/booking-items/${id}`,
          { status: "pending" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "pending" } : item,
          ),
        );
        alert("✅ Booking reactivated! Please confirm your booking.");
      }
    } catch (err: any) {
      console.error("Error reactivating booking:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to reactivate booking. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Funksioni për restaurimin e rezervimit (nga deleted në pending)
  const handleRestoreBooking = async (id: string) => {
    setActionLoading(id);
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "pending" } : item,
          ),
        );
        alert("✅ Booking restored! Please confirm your booking.");
      } else {
        await api.patch(
          `/booking-items/${id}`,
          { status: "pending" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, status: "pending" } : item,
          ),
        );
        alert("✅ Booking restored! Please confirm your booking.");
      }
    } catch (err: any) {
      console.error("Error restoring booking:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to restore booking. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (item: BookingItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return { bg: "#d4edda", color: "#155724", text: "✅ Confirmed" };
      case "pending":
        return { bg: "#fff3cd", color: "#856404", text: "⏳ Pending" };
      case "cancelled":
        return { bg: "#f8d7da", color: "#721c24", text: "❌ Cancelled" };
      case "deleted":
        return { bg: "#e2e3e5", color: "#383d41", text: "🗑️ Deleted" };
      default:
        return { bg: "#e2e3e5", color: "#383d41", text: "Unknown" };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return "✈️";
      case "hotel":
        return "🏨";
      case "package":
        return "🎒";
      default:
        return "📦";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "#4facfe";
      case "hotel":
        return "#f093fb";
      case "package":
        return "#43e97b";
      default:
        return "#fa709a";
    }
  };

  // Ngarko të dhënat kur komponenti mountohet
  useEffect(() => {
    if (token) {
      fetchBookingItems();
    } else {
      setItems(getDemoData());
      setLoading(false);
    }
  }, [token]);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const totalPrice = filteredItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0,
  );
  const confirmedCount = items.filter((i) => i.status === "confirmed").length;
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const cancelledCount = items.filter((i) => i.status === "cancelled").length;
  const deletedCount = items.filter((i) => i.status === "deleted").length;

  if (loading) {
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <h2 style={{ color: "#666" }}>Loading your bookings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          {!token && (
            <div
              style={{
                background: "#fff3cd",
                color: "#856404",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              ⚠️ You are viewing demo data. Please login to see your actual
              bookings.
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              ⚠️ {error}
            </div>
          )}
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            📋 Booking Items
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Manage and track all your travel bookings in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onClick={() => setFilter("all")}
          >
            <div style={{ fontSize: "28px", marginBottom: "5px" }}>📊</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
              {items.length}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Total Items
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onClick={() => setFilter("confirmed")}
          >
            <div style={{ fontSize: "28px", marginBottom: "5px" }}>✅</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
              {confirmedCount}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Confirmed
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onClick={() => setFilter("pending")}
          >
            <div style={{ fontSize: "28px", marginBottom: "5px" }}>⏳</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
              {pendingCount}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Pending
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onClick={() => setFilter("cancelled")}
          >
            <div style={{ fontSize: "28px", marginBottom: "5px" }}>❌</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
              {cancelledCount}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Cancelled
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onClick={() => setFilter("deleted")}
          >
            <div style={{ fontSize: "28px", marginBottom: "5px" }}>🗑️</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
              {deletedCount}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Deleted
            </p>
          </div>
        </div>

        {/* Total Price Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "center",
            boxShadow: "0 5px 20px rgba(79, 172, 254, 0.3)",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "5px" }}>💰</div>
          <h3 style={{ color: "white", margin: 0, fontSize: "16px" }}>
            Total Spent
          </h3>
          <p
            style={{
              color: "white",
              fontSize: "32px",
              fontWeight: "bold",
              margin: "5px 0 0 0",
            }}
          >
            ${totalPrice.toLocaleString()}
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          {(
            ["all", "confirmed", "pending", "cancelled", "deleted"] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 20px",
                background: filter === f ? "#4facfe" : "white",
                color: filter === f ? "white" : "#666",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.3s",
                boxShadow:
                  filter === f
                    ? "0 2px 10px rgba(79,172,254,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {f === "all"
                ? "All"
                : f === "confirmed"
                  ? "✅ Confirmed"
                  : f === "pending"
                    ? "⏳ Pending"
                    : f === "cancelled"
                      ? "❌ Cancelled"
                      : "🗑️ Deleted"}
            </button>
          ))}
        </div>

        {/* Booking Items List */}
        {filteredItems.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
            <h2 style={{ color: "#2c3e50", marginBottom: "10px" }}>
              No booking items found
            </h2>
            <p style={{ color: "#666" }}>
              You don't have any {filter !== "all" ? filter : ""} bookings yet.
            </p>
            <button
              onClick={() => navigate("/travel-packages")}
              style={{
                marginTop: "20px",
                padding: "12px 30px",
                background: "#4facfe",
                color: "white",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Browse Packages →
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {filteredItems.map((item) => {
              const statusStyle = getStatusColor(item.status);
              const typeColor = getTypeColor(item.type);
              const isLoading = actionLoading === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {/* Image Section */}
                    <div
                      style={{
                        width: "250px",
                        height: "200px",
                        overflow: "hidden",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.destination}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s",
                        }}
                      />
                    </div>

                    {/* Content Section */}
                    <div style={{ flex: 1, padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "15px",
                        }}
                      >
                        {/* Left Info */}
                        <div style={{ flex: 2 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              flexWrap: "wrap",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "28px",
                                background: `${typeColor}20`,
                                width: "45px",
                                height: "45px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "12px",
                                border: `1px solid ${typeColor}`,
                              }}
                            >
                              {getTypeIcon(item.type)}
                            </div>
                            <h3
                              style={{
                                margin: 0,
                                color: "#2c3e50",
                                fontSize: "18px",
                              }}
                            >
                              {item.title}
                            </h3>
                          </div>
                          <p
                            style={{
                              margin: "0 0 8px 0",
                              color: "#666",
                              fontSize: "14px",
                            }}
                          >
                            📍 {item.destination}
                          </p>
                          {item.checkIn && item.checkOut ? (
                            <p
                              style={{
                                margin: 0,
                                color: "#888",
                                fontSize: "13px",
                              }}
                            >
                              📅 {item.checkIn} → {item.checkOut} (
                              {Math.ceil(
                                (new Date(item.checkOut).getTime() -
                                  new Date(item.checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              nights)
                            </p>
                          ) : item.date ? (
                            <p
                              style={{
                                margin: 0,
                                color: "#888",
                                fontSize: "13px",
                              }}
                            >
                              📅 {item.date}
                            </p>
                          ) : null}
                          {item.description && (
                            <p
                              style={{
                                margin: "8px 0 0 0",
                                color: "#999",
                                fontSize: "12px",
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Right Price & Actions */}
                        <div style={{ textAlign: "right", minWidth: "180px" }}>
                          <p
                            style={{
                              fontSize: "22px",
                              fontWeight: "bold",
                              color: "#4facfe",
                              margin: "0 0 8px 0",
                            }}
                          >
                            ${item.price.toLocaleString()}
                          </p>
                          <div
                            style={{
                              display: "inline-block",
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 500,
                              marginBottom: "10px",
                            }}
                          >
                            {statusStyle.text}
                          </div>
                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              gap: "8px",
                              justifyContent: "flex-end",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              style={{
                                padding: "5px 14px",
                                background: "#4facfe",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "11px",
                                fontWeight: 500,
                              }}
                              onClick={() => handleViewDetails(item)}
                            >
                              View Details
                            </button>

                            {item.status === "pending" && (
                              <button
                                style={{
                                  padding: "5px 14px",
                                  background: "#43e97b",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: isLoading ? "wait" : "pointer",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  opacity: isLoading ? 0.5 : 1,
                                }}
                                onClick={() => handleConfirmBooking(item.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Confirm"}
                              </button>
                            )}

                            {item.status === "cancelled" && (
                              <button
                                style={{
                                  padding: "5px 14px",
                                  background: "#f39c12",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: isLoading ? "wait" : "pointer",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  opacity: isLoading ? 0.5 : 1,
                                }}
                                onClick={() => handleReactivateBooking(item.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Reactivate"}
                              </button>
                            )}

                            {item.status !== "cancelled" &&
                              item.status !== "deleted" && (
                                <button
                                  style={{
                                    padding: "5px 14px",
                                    background: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: isLoading ? "wait" : "pointer",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    opacity: isLoading ? 0.5 : 1,
                                  }}
                                  onClick={() => handleCancelClick(item.id)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? "⏳..." : "Cancel"}
                                </button>
                              )}

                            {item.status === "deleted" ? (
                              <button
                                style={{
                                  padding: "5px 14px",
                                  background: "#28a745",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: isLoading ? "wait" : "pointer",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  opacity: isLoading ? 0.5 : 1,
                                }}
                                onClick={() => handleRestoreBooking(item.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Restore"}
                              </button>
                            ) : (
                              <button
                                style={{
                                  padding: "5px 14px",
                                  background: "#dc3545",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: isLoading ? "wait" : "pointer",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  opacity: isLoading ? 0.5 : 1,
                                }}
                                onClick={() => handleDeleteClick(item.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Delete"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 30px",
              background: "white",
              color: "#4facfe",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Modal for View Details */}
      {showModal && selectedItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "25px",
              padding: "30px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                color: "#999",
              }}
            >
              ✕
            </button>

            {/* Modal Image */}
            {selectedItem.image && (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  overflow: "hidden",
                  borderRadius: "15px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={selectedItem.image}
                  alt={selectedItem.destination}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                {getTypeIcon(selectedItem.type)}
              </div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "22px" }}>
                {selectedItem.title}
              </h2>
              <p style={{ color: "#666", fontSize: "14px" }}>
                {selectedItem.destination}
              </p>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Booking ID:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  #{selectedItem.id}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Type:</span>
                <span
                  style={{
                    fontWeight: 500,
                    textTransform: "capitalize",
                    fontSize: "14px",
                  }}
                >
                  {selectedItem.type}
                </span>
              </div>
              {selectedItem.checkIn && selectedItem.checkOut && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "14px" }}>
                      Check-in:
                    </span>
                    <span style={{ fontWeight: 500, fontSize: "14px" }}>
                      {selectedItem.checkIn}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: "14px" }}>
                      Check-out:
                    </span>
                    <span style={{ fontWeight: 500, fontSize: "14px" }}>
                      {selectedItem.checkOut}
                    </span>
                  </div>
                </>
              )}
              {selectedItem.date && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "14px" }}>Date:</span>
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {selectedItem.date}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Price:</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#4facfe",
                    fontSize: "20px",
                  }}
                >
                  ${selectedItem.price.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Status:</span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {getStatusColor(selectedItem.status).text}
                </span>
              </div>
              {selectedItem.description && (
                <div
                  style={{
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    Description:
                  </span>
                  <p
                    style={{
                      margin: "10px 0 0 0",
                      color: "#555",
                      lineHeight: "1.5",
                      fontSize: "13px",
                    }}
                  >
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  alert("Payment page will be available soon!");
                  navigate("/Payments");
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#4facfe",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Make Payment
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f0f0f0",
                  color: "#666",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Cancel/Delete - PËRMIRËSUAR */}
      {showConfirmModal && confirmAction && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            padding: "20px",
          }}
          onClick={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {confirmAction.type === "cancel" ? "❌" : "🗑️"}
            </div>
            <h3 style={{ color: "#2c3e50", marginBottom: "12px" }}>
              {confirmAction.type === "cancel"
                ? "Cancel Booking"
                : "Delete Booking"}
            </h3>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Are you sure you want to{" "}
              {confirmAction.type === "cancel" ? "cancel" : "delete"} this
              booking?
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={
                  confirmAction.type === "cancel"
                    ? confirmCancel
                    : confirmDelete
                }
                style={{
                  padding: "10px 24px",
                  background:
                    confirmAction.type === "cancel" ? "#e74c3c" : "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Yes, {confirmAction.type === "cancel" ? "Cancel" : "Delete"}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                style={{
                  padding: "10px 24px",
                  background: "#f0f0f0",
                  color: "#666",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingItems;
