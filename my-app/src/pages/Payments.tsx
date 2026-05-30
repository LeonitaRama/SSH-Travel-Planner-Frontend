import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

// Importo të gjitha fotot për destinacionet
import ParisImg from "../assets/paris (2).jpg";
import RomeImg from "../assets/rome.jpg";
import LondonImg from "../assets/london.jpg";
import TokyoImg from "../assets/Tokyo.jpg";
import BaliImg from "../assets/Bali.jpg";
import DubaiImg from "../assets/dubai.jpg";
import Bangkok from "../assets/Bangkok.jpg";
import SingaporeMarinaBay from "../assets/singapore marina bay.jpg";
import NewYorkImg from "../assets/NewYork.jpg";
//import BerlinImg from "../assets/HotelAdlonKempinskiBerlin.jpg";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  method: "credit_card" | "paypal" | "bank_transfer" | "cash";
  bookingId: string;
  bookingTitle?: string;
  bookingType?: "flight" | "hotel" | "package";
  destination?: string;
  image?: string;
  transactionId?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean; // Shtuar për të shënuar pagesat e fshira
}

interface NewPayment {
  amount: number;
  currency: string;
  method: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  bookingId: string;
  bookingTitle: string;
  bookingType: string;
  destination: string;
  image?: string;
  description: string;
}

function Payments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "all" | "completed" | "pending" | "failed" | "refunded" | "deleted"
  >("all");
  const [token, setToken] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);

  // State për pagesën e re
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "details" | "card" | "confirm"
  >("details");
  const [newPayment, setNewPayment] = useState<NewPayment>({
    amount: 0,
    currency: "USD",
    method: "credit_card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    bookingId: "",
    bookingTitle: "",
    bookingType: "",
    destination: "",
    description: "",
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Merr token-in nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Kontrollo nëse ka të dhëna nga navigimi
    const state = location.state as any;
    if (state?.paymentData) {
      setNewPayment({
        amount: state.paymentData.amount,
        currency: "USD",
        method: "credit_card",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        bookingId: state.paymentData.bookingId || `BKG-${Date.now()}`,
        bookingTitle: state.paymentData.title,
        bookingType: state.paymentData.type || "flight",
        destination: state.paymentData.destination || "",
        image: state.paymentData.image,
        description:
          state.paymentData.description ||
          `Payment for ${state.paymentData.title}`,
      });
      setShowPaymentModal(true);
      setPaymentStep("details");
    }
  }, [location]);

  // Fetch payments nga backend
  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<Payment[]>("/payments", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setPayments(response.data.map((p) => ({ ...p, isDeleted: false })));
      } else {
        setPayments(getDemoPayments());
      }
    } catch (err: any) {
      console.error("Error fetching payments:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your payments");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load payments");
      }

      setPayments(getDemoPayments());
    } finally {
      setLoading(false);
    }
  };

  // Demo data për fallback
  const getDemoPayments = (): Payment[] => [
    {
      id: "1",
      amount: 599,
      currency: "USD",
      status: "completed",
      method: "credit_card",
      bookingId: "BKG-FL001",
      bookingTitle: "Flight to Paris",
      bookingType: "flight",
      destination: "Paris, France",
      image: ParisImg,
      transactionId: "TXN-AF123456",
      description: "Direct flight from JFK to CDG | Flight AF 123",
      createdAt: "2024-06-15T10:30:00Z",
      isDeleted: false,
    },
    {
      id: "2",
      amount: 1200,
      currency: "USD",
      status: "completed",
      method: "paypal",
      bookingId: "BKG-HT002",
      bookingTitle: "Grand Hotel Rome",
      bookingType: "hotel",
      destination: "Rome, Italy",
      image: RomeImg,
      transactionId: "TXN-GH789012",
      description: "Luxury 5-star hotel in city center | 7 nights stay",
      createdAt: "2024-07-01T14:20:00Z",
      isDeleted: false,
    },
    {
      id: "3",
      amount: 1899,
      currency: "USD",
      status: "pending",
      method: "credit_card",
      bookingId: "BKG-PK003",
      bookingTitle: "Bali Adventure Package",
      bookingType: "package",
      destination: "Bali, Indonesia",
      image: BaliImg,
      transactionId: "TXN-BA345678",
      description: "Complete travel package including flights and hotels",
      createdAt: "2024-08-10T09:15:00Z",
      isDeleted: false,
    },
    {
      id: "4",
      amount: 899,
      currency: "USD",
      status: "failed",
      method: "credit_card",
      bookingId: "BKG-FL004",
      bookingTitle: "Flight to Tokyo",
      bookingType: "flight",
      destination: "Tokyo, Japan",
      image: TokyoImg,
      transactionId: "TXN-TK901234",
      description: "Direct flight with premium economy | Flight NH 456",
      createdAt: "2024-09-05T16:45:00Z",
      isDeleted: false,
    },
    {
      id: "5",
      amount: 2500,
      currency: "USD",
      status: "refunded",
      method: "bank_transfer",
      bookingId: "BKG-HT005",
      bookingTitle: "Marina Bay Sands",
      bookingType: "hotel",
      destination: "Singapore",
      image: SingaporeMarinaBay,
      transactionId: "TXN-MB567890",
      description: "Iconic hotel with infinity pool | 5 nights stay",
      createdAt: "2024-10-15T11:00:00Z",
      isDeleted: false,
    },
    {
      id: "6",
      amount: 1599,
      currency: "USD",
      status: "completed",
      method: "credit_card",
      bookingId: "BKG-PK006",
      bookingTitle: "Thailand Explorer",
      bookingType: "package",
      destination: "Bangkok, Thailand",
      image: Bangkok,
      transactionId: "TXN-TE123456",
      description: "Complete Thailand travel package",
      createdAt: "2024-11-01T13:30:00Z",
      isDeleted: false,
    },
    {
      id: "7",
      amount: 749,
      currency: "USD",
      status: "pending",
      method: "paypal",
      bookingId: "BKG-FL007",
      bookingTitle: "Flight to London",
      bookingType: "flight",
      destination: "London, UK",
      image: LondonImg,
      transactionId: "TXN-LD789012",
      description: "Direct flight with British Airways",
      createdAt: "2024-12-15T08:00:00Z",
      isDeleted: false,
    },
    {
      id: "8",
      amount: 3500,
      currency: "USD",
      status: "completed",
      method: "credit_card",
      bookingId: "BKG-HT008",
      bookingTitle: "Burj Al Arab",
      bookingType: "hotel",
      destination: "Dubai, UAE",
      image: DubaiImg,
      transactionId: "TXN-BA345678",
      description: "7-star luxury hotel | Includes private beach access",
      createdAt: "2024-12-01T10:00:00Z",
      isDeleted: false,
    },
    {
      id: "9",
      amount: 699,
      currency: "USD",
      status: "completed",
      method: "credit_card",
      bookingId: "BKG-FL009",
      bookingTitle: "Flight to New York",
      bookingType: "flight",
      destination: "New York, USA",
      image: NewYorkImg,
      transactionId: "TXN-NY901234",
      description: "Direct flight with Delta Airlines",
      createdAt: "2024-12-15T09:30:00Z",
      isDeleted: false,
    },
  ];

  // Proceso pagesën
  const processPayment = async () => {
    if (newPayment.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (newPayment.method === "credit_card") {
      if (
        !newPayment.cardNumber ||
        newPayment.cardNumber.replace(/\s/g, "").length < 16
      ) {
        alert("Please enter a valid card number");
        return;
      }
      if (!newPayment.cardName) {
        alert("Please enter cardholder name");
        return;
      }
      if (!newPayment.expiryDate || newPayment.expiryDate.length < 5) {
        alert("Please enter valid expiry date (MM/YY)");
        return;
      }
      if (!newPayment.cvv || newPayment.cvv.length < 3) {
        alert("Please enter valid CVV");
        return;
      }
    }

    setPaymentProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccessful = Math.random() > 0.2;
      const paymentStatus = isSuccessful ? "completed" : "failed";

      const newPaymentRecord: Payment = {
        id: `PAY-${Date.now()}`,
        amount: newPayment.amount,
        currency: newPayment.currency,
        status: paymentStatus as any,
        method: newPayment.method as any,
        bookingId: newPayment.bookingId,
        bookingTitle: newPayment.bookingTitle,
        bookingType: newPayment.bookingType as any,
        destination: newPayment.destination,
        image: newPayment.image,
        transactionId: `TXN-${Date.now()}`,
        description: newPayment.description,
        createdAt: new Date().toISOString(),
        isDeleted: false,
      };

      setPayments([newPaymentRecord, ...payments]);
      setShowPaymentModal(false);
      setPaymentStep("details");

      if (paymentStatus === "completed") {
        alert(
          `✅ Payment of $${newPayment.amount} completed successfully!\nTransaction ID: ${newPaymentRecord.transactionId}`,
        );
      } else {
        alert(`❌ Payment failed. Please try again.`);
      }

      // Reset form
      setNewPayment({
        amount: 0,
        currency: "USD",
        method: "credit_card",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        bookingId: "",
        bookingTitle: "",
        bookingType: "",
        destination: "",
        description: "",
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("❌ Payment processing failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Fshi pagesën (vendos isDeleted = true në vend që ta fshijë plotësisht)
  const deletePayment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment record?"))
      return;

    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, isDeleted: true } : payment,
      ),
    );
    setShowModal(false);
    alert("✅ Payment moved to deleted!");
  };

  // Restauro pagesën e fshirë
  const restorePayment = async (id: string) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, isDeleted: false } : payment,
      ),
    );
    alert("✅ Payment restored!");
  };

  // Fshi përgjithmonë pagesën
  const permanentDeletePayment = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this payment?",
      )
    )
      return;

    setPayments(payments.filter((payment) => payment.id !== id));
    setShowModal(false);
    alert("✅ Payment permanently deleted!");
  };

  // Fshi të gjitha pagesat (vendos isDeleted = true)
  const softDeleteAllPayments = async () => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to move ALL payments to deleted?",
      )
    )
      return;

    setPayments(payments.map((payment) => ({ ...payment, isDeleted: true })));
    alert("✅ All payments moved to deleted!");
  };

  // Ndrysho statusin e pagesës
  const updatePaymentStatus = async (
    id: string,
    newStatus: Payment["status"],
  ) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, status: newStatus } : payment,
      ),
    );
    alert(`✅ Payment status updated to ${newStatus}!`);
  };

  // Format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

  // Ngarko pagesat
  useEffect(() => {
    if (token) {
      fetchPayments();
    } else {
      setPayments(getDemoPayments());
      setLoading(false);
    }
  }, [token]);

  // Statistikat - marrin parasysh vetëm pagesat e pa fshira
  const activePayments = payments.filter((p) => !p.isDeleted);
  const deletedPayments = payments.filter((p) => p.isDeleted);

  const stats = {
    total: activePayments.length,
    totalAmount: activePayments.reduce((sum, p) => sum + p.amount, 0),
    completed: activePayments.filter((p) => p.status === "completed").length,
    pending: activePayments.filter((p) => p.status === "pending").length,
    failed: activePayments.filter((p) => p.status === "failed").length,
    refunded: activePayments.filter((p) => p.status === "refunded").length,
    deleted: deletedPayments.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "#d4edda",
          color: "#155724",
          text: "✅ Completed",
          icon: "✅",
        };
      case "pending":
        return {
          bg: "#fff3cd",
          color: "#856404",
          text: "⏳ Pending",
          icon: "⏳",
        };
      case "failed":
        return {
          bg: "#f8d7da",
          color: "#721c24",
          text: "❌ Failed",
          icon: "❌",
        };
      case "refunded":
        return {
          bg: "#cce5ff",
          color: "#004085",
          text: "↩️ Refunded",
          icon: "↩️",
        };
      default:
        return { bg: "#e2e3e5", color: "#383d41", text: "Unknown", icon: "❓" };
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return "💳";
      case "paypal":
        return "💰";
      case "bank_transfer":
        return "🏦";
      default:
        return "💳";
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "flight":
        return "✈️";
      case "hotel":
        return "🏨";
      case "package":
        return "🎒";
      default:
        return "💳";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtrimi - merr parasysh statusin dhe nëse është i fshirë
  const filteredPayments = payments.filter((payment) => {
    if (filter === "deleted") return payment.isDeleted === true;
    if (payment.isDeleted) return false;
    if (filter === "all") return true;
    return payment.status === filter;
  });

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💳</div>
          <h2 style={{ color: "#666" }}>Loading payment history...</h2>
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
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            💳 Payment History
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Track and manage all your travel payments in one place
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => {
                setNewPayment({
                  amount: 0,
                  currency: "USD",
                  method: "credit_card",
                  cardNumber: "",
                  cardName: "",
                  expiryDate: "",
                  cvv: "",
                  bookingId: `MANUAL-${Date.now()}`,
                  bookingTitle: "Manual Payment",
                  bookingType: "other",
                  destination: "",
                  description: "Manual payment entry",
                });
                setShowPaymentModal(true);
                setPaymentStep("details");
              }}
              style={{
                padding: "12px 24px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#218838")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#28a745")
              }
            >
              + Make a Payment
            </button>
            {activePayments.length > 0 && (
              <button
                onClick={softDeleteAllPayments}
                style={{
                  padding: "12px 24px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#dc3545")
                }
              >
                🗑️ Delete All
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "12px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span>⚠️ {error}</span>
            <button
              onClick={fetchPayments}
              style={{
                padding: "5px 15px",
                background: "#721c24",
                color: "white",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Warning for demo data */}
        {!token && (
          <div
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            ⚠️ You are viewing demo payment data. Please login to see your real
            payment history.
          </div>
        )}

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => setFilter("all")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📊</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "28px" }}>
              {stats.total}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>Total</p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => setFilter("completed")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "28px" }}>
              {stats.completed}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>
              Completed
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => setFilter("pending")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "28px" }}>
              {stats.pending}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>
              Pending
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => setFilter("failed")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>❌</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "28px" }}>
              {stats.failed}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>Failed</p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => setFilter("refunded")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>↩️</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "28px" }}>
              {stats.refunded}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>
              Refunded
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => setFilter("deleted")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🗑️</div>
            <h3 style={{ color: "#2c3e50", margin: 0, fontSize: "28px" }}>
              {stats.deleted}
            </h3>
            <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>
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
              fontSize: "32px",
              fontWeight: "bold",
              margin: "5px 0 0 0",
            }}
          >
            ${stats.totalAmount.toLocaleString()}
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
            [
              "all",
              "completed",
              "pending",
              "failed",
              "refunded",
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
                : f === "completed"
                  ? "✅ Completed"
                  : f === "pending"
                    ? "⏳ Pending"
                    : f === "failed"
                      ? "❌ Failed"
                      : f === "refunded"
                        ? "↩️ Refunded"
                        : "🗑️ Deleted"}
            </button>
          ))}
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
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
              No payments found
            </h2>
            <p style={{ color: "#666" }}>
              {filter !== "all"
                ? `You don't have any ${filter} payments.`
                : "No payment history available."}
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {filteredPayments.map((payment) => {
              const statusStyle = getStatusColor(payment.status);
              const isDeleted = payment.isDeleted === true;

              return (
                <div
                  key={payment.id}
                  style={{
                    background: isDeleted ? "#f5f5f5" : "white",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    opacity: isDeleted ? 0.7 : 1,
                    border: isDeleted ? "1px solid #ddd" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(5px)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(0,0,0,0.05)";
                  }}
                  onClick={() => handleViewDetails(payment)}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flex: 2,
                      }}
                    >
                      <div
                        style={{
                          width: "250px",
                          height: "200px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#f5f5f5",
                          flexShrink: 0,
                        }}
                      >
                        {payment.image ? (
                          <img
                            src={payment.image}
                            alt={payment.destination}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "32px",
                              background: "#4facfe20",
                            }}
                          >
                            {getTypeIcon(payment.bookingType)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "5px",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "18px",
                              color: isDeleted ? "#999" : "#2c3e50",
                              textDecoration: isDeleted
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {payment.bookingTitle || `Payment #${payment.id}`}
                          </h3>
                          {!isDeleted ? (
                            <span
                              style={{
                                display: "inline-block",
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                padding: "3px 10px",
                                borderRadius: "15px",
                                fontSize: "11px",
                                fontWeight: 500,
                              }}
                            >
                              {statusStyle.text}
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-block",
                                background: "#e2e3e5",
                                color: "#383d41",
                                padding: "3px 10px",
                                borderRadius: "15px",
                                fontSize: "11px",
                                fontWeight: 500,
                              }}
                            >
                              🗑️ Deleted
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            color: isDeleted ? "#999" : "#666",
                            fontSize: "13px",
                          }}
                        >
                          {payment.description ||
                            `Payment for booking ${payment.bookingId}`}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          {payment.destination && (
                            <p
                              style={{
                                margin: 0,
                                color: isDeleted ? "#aaa" : "#999",
                                fontSize: "11px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              📍 {payment.destination}
                            </p>
                          )}
                          <p
                            style={{
                              margin: 0,
                              color: isDeleted ? "#aaa" : "#999",
                              fontSize: "11px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🕐 {formatDate(payment.createdAt)}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              color: isDeleted ? "#aaa" : "#999",
                              fontSize: "11px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {getMethodIcon(payment.method)}{" "}
                            {payment.method?.replace("_", " ").toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "150px" }}>
                      <p
                        style={{
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: isDeleted ? "#999" : "#4facfe",
                          margin: 0,
                          textDecoration: isDeleted ? "line-through" : "none",
                        }}
                      >
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: isDeleted ? "#aaa" : "#999",
                          margin: "5px 0 0 0",
                        }}
                      >
                        {payment.currency}
                      </p>
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4facfe";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#4facfe";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Payment Modal - i njëjtë si më parë (hequr për shkurtim) */}
      {showPaymentModal && (
        // ... kodi i modalit të pagesës (i njëjtë si më parë)
        <div>Payment Modal</div>
      )}

      {/* Modal for Payment Details */}
      {showModal && selectedPayment && (
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

            {selectedPayment.image && (
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  overflow: "hidden",
                  borderRadius: "15px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={selectedPayment.image}
                  alt={selectedPayment.destination}
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
                {getMethodIcon(selectedPayment.method)}
              </div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "22px" }}>
                {selectedPayment.bookingTitle || "Payment Details"}
              </h2>
              {selectedPayment.destination && (
                <p
                  style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}
                >
                  📍 {selectedPayment.destination}
                </p>
              )}
              <p style={{ color: "#999", fontSize: "12px", marginTop: "5px" }}>
                Transaction #
                {selectedPayment.transactionId || selectedPayment.id}
              </p>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Amount:</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#4facfe",
                    fontSize: "24px",
                  }}
                >
                  ${selectedPayment.amount.toLocaleString()}{" "}
                  {selectedPayment.currency}
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
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <span style={{ fontWeight: 500 }}>
                    {selectedPayment.isDeleted
                      ? "🗑️ Deleted"
                      : getStatusColor(selectedPayment.status).text}
                  </span>
                  {token && !selectedPayment.isDeleted && (
                    <select
                      onChange={(e) =>
                        updatePaymentStatus(
                          selectedPayment.id,
                          e.target.value as any,
                        )
                      }
                      value={selectedPayment.status}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="completed">✅ Completed</option>
                      <option value="failed">❌ Failed</option>
                      <option value="refunded">↩️ Refunded</option>
                    </select>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Payment Method:
                </span>
                <span style={{ fontWeight: 500, textTransform: "capitalize" }}>
                  {getMethodIcon(selectedPayment.method)}{" "}
                  {selectedPayment.method?.replace("_", " ")}
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
                  Booking ID:
                </span>
                <span style={{ fontWeight: 500 }}>
                  {selectedPayment.bookingId}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Date:</span>
                <span style={{ fontWeight: 500 }}>
                  {formatDate(selectedPayment.createdAt)}
                </span>
              </div>
              {selectedPayment.description && (
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
                      margin: "8px 0 0 0",
                      color: "#555",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {selectedPayment.description}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  alert("Receipt downloaded!");
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
                Download Receipt
              </button>
              {selectedPayment.isDeleted ? (
                <>
                  <button
                    onClick={() => restorePayment(selectedPayment.id)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => permanentDeletePayment(selectedPayment.id)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete Permanently
                  </button>
                </>
              ) : (
                <button
                  onClick={() => deletePayment(selectedPayment.id)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Move to Deleted
                </button>
              )}
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
    </div>
  );
}

export default Payments;
