import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

// Importo të gjitha fotot (për fallback)
import ParisImg from "../assets/paris (2).jpg";
import RomeImg from "../assets/rome.jpg";
import LondonImg from "../assets/london.jpg";
import TokyoImg from "../assets/Tokyo.jpg";
import BaliImg from "../assets/Bali.jpg";
import DubaiImg from "../assets/dubai.jpg";
import Bangkok from "../assets/Bangkok.jpg";
import SingaporeMarinaBay from "../assets/singapore marina bay.jpg";

interface Booking {
  id: string;
  bookingNumber: string;
  type: "flight" | "hotel" | "package";
  title: string;
  destination: string;
  image?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  price: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "deleted";
  passengerName: string;
  passengerEmail: string;
  passengerPhone?: string;
  quantity?: number;
  specialRequests?: string;
  createdAt: string;
}

// Demo data për fallback
const getDemoBookings = (): Booking[] => [
  {
    id: "1",
    bookingNumber: "SSH-2024-001",
    type: "flight",
    title: "Flight to Paris",
    destination: "Paris, France",
    image: ParisImg,
    date: "2024-06-15",
    price: 599,
    status: "confirmed",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    passengerPhone: "+1 234 567 8900",
    quantity: 2,
    specialRequests: "Window seats, vegetarian meals",
    createdAt: "2024-05-01",
  },
  {
    id: "2",
    bookingNumber: "SSH-2024-002",
    type: "hotel",
    title: "Grand Hotel Rome",
    destination: "Rome, Italy",
    image: RomeImg,
    checkIn: "2024-07-01",
    checkOut: "2024-07-07",
    price: 1200,
    status: "confirmed",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    quantity: 2,
    specialRequests: "High floor, sea view",
    createdAt: "2024-05-05",
  },
  {
    id: "3",
    bookingNumber: "SSH-2024-003",
    type: "package",
    title: "Bali Adventure Package",
    destination: "Bali, Indonesia",
    image: BaliImg,
    date: "2024-08-10",
    price: 1899,
    status: "pending",
    passengerName: "Sarah Johnson",
    passengerEmail: "sarah@example.com",
    passengerPhone: "+1 234 567 8901",
    quantity: 4,
    specialRequests: "Halal food options",
    createdAt: "2024-05-10",
  },
  {
    id: "4",
    bookingNumber: "SSH-2024-004",
    type: "flight",
    title: "Flight to Tokyo",
    destination: "Tokyo, Japan",
    image: TokyoImg,
    date: "2024-09-05",
    price: 899,
    status: "cancelled",
    passengerName: "Michael Brown",
    passengerEmail: "michael@example.com",
    quantity: 1,
    createdAt: "2024-05-15",
  },
  {
    id: "5",
    bookingNumber: "SSH-2024-005",
    type: "hotel",
    title: "Marina Bay Sands",
    destination: "Singapore",
    image: SingaporeMarinaBay,
    checkIn: "2024-10-15",
    checkOut: "2024-10-20",
    price: 2500,
    status: "completed",
    passengerName: "Emily Davis",
    passengerEmail: "emily@example.com",
    passengerPhone: "+1 234 567 8902",
    quantity: 2,
    createdAt: "2024-05-20",
  },
  {
    id: "6",
    bookingNumber: "SSH-2024-006",
    type: "package",
    title: "Thailand Explorer",
    destination: "Bangkok, Thailand",
    image: Bangkok,
    date: "2024-11-01",
    price: 1599,
    status: "pending",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    quantity: 3,
    createdAt: "2024-05-25",
  },
  {
    id: "7",
    bookingNumber: "SSH-2024-007",
    type: "hotel",
    title: "Burj Al Arab",
    destination: "Dubai, UAE",
    image: DubaiImg,
    checkIn: "2024-12-01",
    checkOut: "2024-12-07",
    price: 3500,
    status: "pending",
    passengerName: "Sarah Johnson",
    passengerEmail: "sarah@example.com",
    quantity: 2,
    createdAt: "2024-06-01",
  },
  {
    id: "8",
    bookingNumber: "SSH-2024-008",
    type: "flight",
    title: "Flight to London",
    destination: "London, UK",
    image: LondonImg,
    date: "2024-12-15",
    price: 749,
    status: "confirmed",
    passengerName: "Michael Brown",
    passengerEmail: "michael@example.com",
    quantity: 1,
    createdAt: "2024-06-05",
  },
];

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "pending" | "cancelled" | "completed" | "deleted"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // State për modal-in e konfirmimit
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Merr token-in nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch bookings nga backend
  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<Booking[]>("/bookings", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setBookings(response.data);
      } else {
        setBookings(getDemoBookings());
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your bookings");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view bookings");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load bookings");
      }

      setBookings(getDemoBookings());
    } finally {
      setLoading(false);
    }
  };

  // Funksioni për konfirmimin e rezervimit - Hap modal konfirmimi
  const handleConfirmClick = (id: string) => {
    setConfirmAction({ type: "confirm", id });
    setShowConfirmModal(true);
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

  // Funksioni për kompletime (completed) - Hap modal konfirmimi
  const handleCompleteClick = (id: string) => {
    setConfirmAction({ type: "complete", id });
    setShowConfirmModal(true);
  };

  // Funksioni për reactivate (rifillimin) e rezervimit - Pa modal, direkt
  const handleReactivateBooking = async (id: string) => {
    setActionLoading(id);
    try {
      const currentItem = bookings.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setBookings(
          bookings.map((item) =>
            item.id === id ? { ...item, status: "pending" } : item,
          ),
        );
        alert("✅ Booking reactivated! Please confirm your booking.");
      } else {
        await api.patch(
          `/bookings/${id}`,
          { status: "pending" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setBookings(
          bookings.map((item) =>
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
      const currentItem = bookings.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "8") {
        setBookings(
          bookings.map((item) =>
            item.id === id ? { ...item, status: "pending" } : item,
          ),
        );
        alert("✅ Booking restored! Please confirm your booking.");
      } else {
        await api.patch(
          `/bookings/${id}`,
          { status: "pending" },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setBookings(
          bookings.map((item) =>
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

  // Funksioni për konfirmimin e veprimit (confirm, cancel, delete, complete)
  const confirmActionHandler = async () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;

    setActionLoading(id);
    try {
      const currentItem = bookings.find((item) => item.id === id);
      if (!currentItem) return;

      if (type === "confirm") {
        if (currentItem.id <= "8") {
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "confirmed" } : item,
            ),
          );
          alert("✅ Booking confirmed successfully!");
        } else {
          await api.patch(
            `/bookings/${id}`,
            { status: "confirmed" },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "tenant-id": localStorage.getItem("tenantId") || "",
              },
            },
          );
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "confirmed" } : item,
            ),
          );
          alert("✅ Booking confirmed successfully!");
        }
      } else if (type === "cancel") {
        if (currentItem.id <= "8") {
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "cancelled" } : item,
            ),
          );
          alert("✅ Booking cancelled successfully!");
        } else {
          await api.patch(
            `/bookings/${id}`,
            { status: "cancelled" },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "tenant-id": localStorage.getItem("tenantId") || "",
              },
            },
          );
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "cancelled" } : item,
            ),
          );
          alert("✅ Booking cancelled successfully!");
        }
      } else if (type === "complete") {
        if (currentItem.id <= "8") {
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "completed" } : item,
            ),
          );
          alert("✅ Booking marked as completed!");
        } else {
          await api.patch(
            `/bookings/${id}`,
            { status: "completed" },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "tenant-id": localStorage.getItem("tenantId") || "",
              },
            },
          );
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "completed" } : item,
            ),
          );
          alert("✅ Booking marked as completed!");
        }
      } else if (type === "delete") {
        if (currentItem.id <= "8") {
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "deleted" } : item,
            ),
          );
          alert("🗑️ Booking moved to deleted!");
        } else {
          await api.patch(
            `/bookings/${id}`,
            { status: "deleted" },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "tenant-id": localStorage.getItem("tenantId") || "",
              },
            },
          );
          setBookings(
            bookings.map((item) =>
              item.id === id ? { ...item, status: "deleted" } : item,
            ),
          );
          alert("🗑️ Booking moved to deleted!");
        }
      }
    } catch (err: any) {
      console.error("Error:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to process. Please try again.",
      );
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
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
      case "completed":
        return { bg: "#cce5ff", color: "#004085", text: "✓ Completed" };
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

  // Ngarko të dhënat kur token ndryshon
  useEffect(() => {
    if (token) {
      fetchBookings();
    } else {
      setBookings(getDemoBookings());
      setLoading(false);
    }
  }, [token]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        booking.bookingNumber.toLowerCase().includes(search) ||
        booking.title.toLowerCase().includes(search) ||
        booking.destination.toLowerCase().includes(search) ||
        booking.passengerName.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const totalSpentAll = bookings.reduce((sum, b) => sum + b.price, 0);
  const totalSpentFiltered = filteredBookings.reduce(
    (sum, b) => sum + b.price,
    0,
  );

  const allStats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    deleted: bookings.filter((b) => b.status === "deleted").length,
  };

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
              <button
                onClick={fetchBookings}
                style={{
                  marginLeft: "10px",
                  padding: "2px 8px",
                  background: "#721c24",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}
          <div style={{ fontSize: "64px", marginBottom: "20px" }}></div>
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            📅 My Bookings
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
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
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
              {allStats.total}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>Total</p>
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
              {allStats.confirmed}
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
              {allStats.pending}
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
            onClick={() => setFilter("completed")}
          >
            <div style={{ fontSize: "28px", marginBottom: "5px" }}>✓</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
              {allStats.completed}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Completed
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
              {allStats.cancelled}
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
              {allStats.deleted}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
              Deleted
            </p>
          </div>
        </div>

        {/* Total Spent Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "center",
            boxShadow: "0 5px 20px rgba(79,172,254,0.3)",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "5px" }}>💰</div>
          <h3 style={{ color: "white", margin: 0, fontSize: "16px" }}>
            Total Spent
          </h3>
          <p
            style={{
              color: "white",
              fontSize: "36px",
              fontWeight: "bold",
              margin: "5px 0 0 0",
            }}
          >
            ${totalSpentAll.toLocaleString()}
          </p>
          {(searchTerm || filter !== "all") && (
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              Showing {filteredBookings.length} of {bookings.length} bookings ($
              {totalSpentFiltered.toLocaleString()} filtered)
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="🔍 Search by booking number, destination, or passenger name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: "none",
              borderRadius: "30px",
              fontSize: "15px",
              outline: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              background: "white",
            }}
          />
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
            [
              "all",
              "confirmed",
              "pending",
              "completed",
              "cancelled",
              "deleted",
            ] as const
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
                    : f === "completed"
                      ? "✓ Completed"
                      : f === "cancelled"
                        ? "❌ Cancelled"
                        : "🗑️ Deleted"}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
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
              No bookings found
            </h2>
            <p style={{ color: "#666" }}>
              {searchTerm
                ? "Try a different search term"
                : `You don't have any ${filter !== "all" ? filter : ""} bookings yet.`}
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
            {filteredBookings.map((booking) => {
              const statusStyle = getStatusColor(booking.status);
              const typeColor = getTypeColor(booking.type);
              const isLoading = actionLoading === booking.id;

              return (
                <div
                  key={booking.id}
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
                        src={booking.image}
                        alt={booking.destination}
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
                              {getTypeIcon(booking.type)}
                            </div>
                            <h3
                              style={{
                                margin: 0,
                                color: "#2c3e50",
                                fontSize: "18px",
                              }}
                            >
                              {booking.title}
                            </h3>
                            <span
                              style={{
                                fontSize: "11px",
                                background: "#f0f0f0",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                color: "#666",
                              }}
                            >
                              #{booking.bookingNumber}
                            </span>
                          </div>
                          <p
                            style={{
                              margin: "0 0 8px 0",
                              color: "#666",
                              fontSize: "14px",
                            }}
                          >
                            📍 {booking.destination}
                          </p>
                          {booking.checkIn && booking.checkOut ? (
                            <p
                              style={{
                                margin: 0,
                                color: "#888",
                                fontSize: "13px",
                              }}
                            >
                              📅 {booking.checkIn} → {booking.checkOut} (
                              {Math.ceil(
                                (new Date(booking.checkOut).getTime() -
                                  new Date(booking.checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              nights)
                            </p>
                          ) : booking.date ? (
                            <p
                              style={{
                                margin: 0,
                                color: "#888",
                                fontSize: "13px",
                              }}
                            >
                              📅 {booking.date}
                            </p>
                          ) : null}
                          <p
                            style={{
                              margin: "5px 0 0 0",
                              color: "#999",
                              fontSize: "12px",
                            }}
                          >
                            👤 {booking.passengerName} • {booking.quantity}{" "}
                            {booking.quantity === 1 ? "traveler" : "travelers"}
                          </p>
                        </div>

                        {/* Right Section */}
                        <div style={{ textAlign: "right", minWidth: "180px" }}>
                          <p
                            style={{
                              fontSize: "22px",
                              fontWeight: "bold",
                              color: "#4facfe",
                              margin: "0 0 8px 0",
                            }}
                          >
                            ${booking.price.toLocaleString()}
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
                              onClick={() => handleViewDetails(booking)}
                            >
                              View Details
                            </button>

                            {booking.status === "pending" && (
                              <>
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
                                  onClick={() => handleConfirmClick(booking.id)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? "⏳..." : "Confirm"}
                                </button>
                                <button
                                  style={{
                                    padding: "5px 14px",
                                    background: "#17a2b8",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: isLoading ? "wait" : "pointer",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    opacity: isLoading ? 0.5 : 1,
                                  }}
                                  onClick={() =>
                                    handleCompleteClick(booking.id)
                                  }
                                  disabled={isLoading}
                                >
                                  {isLoading ? "⏳..." : "Complete"}
                                </button>
                              </>
                            )}

                            {booking.status === "confirmed" && (
                              <button
                                style={{
                                  padding: "5px 14px",
                                  background: "#17a2b8",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: isLoading ? "wait" : "pointer",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  opacity: isLoading ? 0.5 : 1,
                                }}
                                onClick={() => handleCompleteClick(booking.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Complete"}
                              </button>
                            )}

                            {booking.status === "cancelled" && (
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
                                onClick={() =>
                                  handleReactivateBooking(booking.id)
                                }
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Reactivate"}
                              </button>
                            )}

                            {booking.status === "deleted" ? (
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
                                onClick={() => handleRestoreBooking(booking.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "⏳..." : "Restore"}
                              </button>
                            ) : (
                              <>
                                {booking.status !== "cancelled" &&
                                  booking.status !== "completed" && (
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
                                      onClick={() =>
                                        handleCancelClick(booking.id)
                                      }
                                      disabled={isLoading}
                                    >
                                      {isLoading ? "⏳..." : "Cancel"}
                                    </button>
                                  )}
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
                                  onClick={() => handleDeleteClick(booking.id)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? "⏳..." : "Delete"}
                                </button>
                              </>
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
      {showModal && selectedBooking && (
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
              maxWidth: "550px",
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
            {selectedBooking.image && (
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
                  src={selectedBooking.image}
                  alt={selectedBooking.destination}
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
                {getTypeIcon(selectedBooking.type)}
              </div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "22px" }}>
                {selectedBooking.title}
              </h2>
              <p style={{ color: "#666", fontSize: "14px" }}>
                {selectedBooking.destination}
              </p>
              <span
                style={{
                  display: "inline-block",
                  background: getStatusColor(selectedBooking.status).bg,
                  color: getStatusColor(selectedBooking.status).color,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  marginTop: "5px",
                }}
              >
                {getStatusColor(selectedBooking.status).text}
              </span>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <h3
                style={{
                  margin: "0 0 15px 0",
                  color: "#2c3e50",
                  fontSize: "16px",
                }}
              >
                Booking Details
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Booking Number:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedBooking.bookingNumber}
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
                  {selectedBooking.type}
                </span>
              </div>
              {selectedBooking.checkIn && selectedBooking.checkOut ? (
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
                      {selectedBooking.checkIn}
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
                      {selectedBooking.checkOut}
                    </span>
                  </div>
                </>
              ) : selectedBooking.date ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "14px" }}>Date:</span>
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {selectedBooking.date}
                  </span>
                </div>
              ) : null}
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
                  ${selectedBooking.price.toLocaleString()}
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
                  Created:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedBooking.createdAt}
                </span>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "20px",
                marginTop: "10px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 15px 0",
                  color: "#2c3e50",
                  fontSize: "16px",
                }}
              >
                Passenger Information
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Name:</span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedBooking.passengerName}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Email:</span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedBooking.passengerEmail}
                </span>
              </div>
              {selectedBooking.passengerPhone && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    Phone:
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {selectedBooking.passengerPhone}
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
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Travelers:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedBooking.quantity}{" "}
                  {selectedBooking.quantity === 1 ? "person" : "people"}
                </span>
              </div>
              {selectedBooking.specialRequests && (
                <div style={{ marginTop: "12px" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    Special Requests:
                  </span>
                  <p
                    style={{
                      margin: "5px 0 0 0",
                      color: "#555",
                      fontSize: "13px",
                      background: "#f8f9fa",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                  >
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  alert("Payment page will be available soon!");
                  navigate("/payments");
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

      {/* Confirmation Modal for Confirm/Cancel/Delete/Complete */}
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
              {confirmAction.type === "confirm"
                ? "✅"
                : confirmAction.type === "cancel"
                  ? "❌"
                  : confirmAction.type === "complete"
                    ? "✓"
                    : "🗑️"}
            </div>
            <h3 style={{ color: "#2c3e50", marginBottom: "12px" }}>
              {confirmAction.type === "confirm"
                ? "Confirm Booking"
                : confirmAction.type === "cancel"
                  ? "Cancel Booking"
                  : confirmAction.type === "complete"
                    ? "Complete Booking"
                    : "Delete Booking"}
            </h3>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Are you sure you want to{" "}
              {confirmAction.type === "confirm"
                ? "confirm"
                : confirmAction.type === "cancel"
                  ? "cancel"
                  : confirmAction.type === "complete"
                    ? "mark as completed"
                    : "delete"}{" "}
              this booking?
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={confirmActionHandler}
                style={{
                  padding: "10px 24px",
                  background:
                    confirmAction.type === "confirm"
                      ? "#43e97b"
                      : confirmAction.type === "cancel"
                        ? "#e74c3c"
                        : confirmAction.type === "complete"
                          ? "#17a2b8"
                          : "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Yes,{" "}
                {confirmAction.type === "confirm"
                  ? "Confirm"
                  : confirmAction.type === "cancel"
                    ? "Cancel"
                    : confirmAction.type === "complete"
                      ? "Complete"
                      : "Delete"}
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

export default Bookings;
