import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  api from "../services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  tenantId?: string;
}

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "deleted">(
    "all",
  );
  const [token, setToken] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(
    null,
  );

  // Merr token-in nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // Fetch notifications nga backend
  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<Notification[]>("/notifications", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setNotifications(response.data);
      } else {
        setNotifications(getDemoNotifications());
      }
    } catch (err: any) {
      console.error("Error fetching notifications:", err);

      if (err.response?.status === 401) {
        setError("Please login to view notifications");
      } else if (err.code === "ERR_NETWORK") {
      } else {
        setError(err.response?.data?.message || "Failed to load notifications");
      }

      setNotifications(getDemoNotifications());
    } finally {
      setLoading(false);
    }
  };

  // Demo data për fallback
  const getDemoNotifications = (): Notification[] => [
    {
      id: "1",
      title: "Welcome to Travel Planner!",
      message:
        "Thank you for joining us. Start exploring amazing destinations!",
      type: "success",
      isRead: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Special Offer: 20% Off Flights",
      message: "Book your next flight with 20% discount. Offer ends soon!",
      type: "info",
      isRead: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Your booking is confirmed",
      message:
        "Flight to Paris has been confirmed. Check your email for details.",
      type: "success",
      isRead: true,
      isDeleted: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Payment Successful",
      message: "Your payment of $599 has been processed successfully.",
      type: "success",
      isRead: true,
      isDeleted: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Weather Alert",
      message: "Heavy rain expected in Paris this weekend. Pack accordingly!",
      type: "warning",
      isRead: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "6",
      title: "Flight Delay",
      message: "Your flight AF123 has been delayed by 2 hours.",
      type: "error",
      isRead: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "7",
      title: "Old Promotion",
      message: "This promotion has ended.",
      type: "info",
      isRead: true,
      isDeleted: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Shëno notifikimin si të lexuar
  const markAsRead = async (id: string) => {
    setActionLoading(id);
    try {
      const currentItem = notifications.find((n) => n.id === id);
      if (!currentItem) return;

      if (currentItem.id <= "7") {
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif,
          ),
        );
        setShowSuccessMessage("✅ Notification marked as read!");
      } else {
        await api.patch(
          `/notifications/${id}/read`,
          {},
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif,
          ),
        );
        setShowSuccessMessage("✅ Notification marked as read!");
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setShowSuccessMessage("❌ Failed to mark as read. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Shëno të gjitha si të lexuara
  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.isRead && !n.isDeleted)
      .map((n) => n.id);

    if (unreadIds.length === 0) {
      setShowSuccessMessage("No unread notifications to mark as read.");
      return;
    }

    for (const id of unreadIds) {
      try {
        const currentItem = notifications.find((n) => n.id === id);
        if (currentItem && currentItem.id <= "7") {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === id ? { ...notif, isRead: true } : notif,
            ),
          );
        } else {
          await api.patch(
            `/notifications/${id}/read`,
            {},
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "tenant-id": localStorage.getItem("tenantId") || "",
              },
            },
          );
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === id ? { ...notif, isRead: true } : notif,
            ),
          );
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }
    setShowSuccessMessage(
      `✅ All ${unreadIds.length} notifications marked as read!`,
    );
  };

  // Hap modal konfirmimi për fshirje
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  // Konfirmo fshirjen (vendos statusin isDeleted = true)
  const confirmDelete = async () => {
    if (!deleteId) return;

    setActionLoading(deleteId);
    try {
      const currentItem = notifications.find((n) => n.id === deleteId);

      if (currentItem && currentItem.id <= "7") {
        setNotifications(
          notifications.map((notif) =>
            notif.id === deleteId
              ? { ...notif, isDeleted: true, isRead: true }
              : notif,
          ),
        );
        setShowSuccessMessage("✅ Notification moved to deleted!");
      } else {
        await api.patch(
          `/notifications/${deleteId}/delete`,
          {},
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setNotifications(
          notifications.map((notif) =>
            notif.id === deleteId
              ? { ...notif, isDeleted: true, isRead: true }
              : notif,
          ),
        );
        setShowSuccessMessage("✅ Notification moved to deleted!");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      setShowSuccessMessage(
        "❌ Failed to delete notification. Please try again.",
      );
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setDeleteId(null);
    }
  };

  // Restauro notifikimin e fshirë
  const handleRestoreNotification = async (id: string) => {
    setActionLoading(id);
    try {
      const currentItem = notifications.find((n) => n.id === id);

      if (currentItem && currentItem.id <= "7") {
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, isDeleted: false } : notif,
          ),
        );
        setShowSuccessMessage("✅ Notification restored!");
      } else {
        await api.patch(
          `/notifications/${id}/restore`,
          {},
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "tenant-id": localStorage.getItem("tenantId") || "",
            },
          },
        );
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, isDeleted: false } : notif,
          ),
        );
        setShowSuccessMessage("✅ Notification restored!");
      }
    } catch (err) {
      console.error("Error restoring notification:", err);
      setShowSuccessMessage(
        "❌ Failed to restore notification. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Fshi përgjithmonë notifikimin (hard delete)
  const handlePermanentDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this notification?",
      )
    )
      return;

    setActionLoading(id);
    try {
      const currentItem = notifications.find((n) => n.id === id);

      if (currentItem && currentItem.id <= "7") {
        setNotifications(notifications.filter((notif) => notif.id !== id));
        setShowSuccessMessage("✅ Notification permanently deleted!");
      } else {
        await api.delete(`/notifications/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "tenant-id": localStorage.getItem("tenantId") || "",
          },
        });
        setNotifications(notifications.filter((notif) => notif.id !== id));
        setShowSuccessMessage("✅ Notification permanently deleted!");
      }
    } catch (err) {
      console.error("Error permanently deleting notification:", err);
      setShowSuccessMessage(
        "❌ Failed to delete notification. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Ngarko notifikimet kur token ndryshon
  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications(getDemoNotifications());
      setLoading(false);
    }
  }, [token]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return { bg: "#d4edda", border: "#28a745", icon: "#28a745" };
      case "warning":
        return { bg: "#fff3cd", border: "#ffc107", icon: "#ffc107" };
      case "error":
        return { bg: "#f8d7da", border: "#dc3545", icon: "#dc3545" };
      default:
        return { bg: "#cce5ff", border: "#17a2b8", icon: "#17a2b8" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead && !notif.isDeleted;
    if (filter === "read") return notif.isRead && !notif.isDeleted;
    if (filter === "deleted") return notif.isDeleted === true;
    return !notif.isDeleted;
  });

  const unreadCount = notifications.filter(
    (n) => !n.isRead && !n.isDeleted,
  ).length;
  const deletedCount = notifications.filter((n) => n.isDeleted === true).length;

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔔</div>
          <h2 style={{ color: "#666" }}>Loading notifications...</h2>
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
            🔔 Notifications
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Stay updated with your travel alerts and announcements
          </p>
        </div>

        {/* Success Message Toast */}
        {showSuccessMessage && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              background: showSuccessMessage.includes("✅")
                ? "#28a745"
                : "#dc3545",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              zIndex: 1002,
              fontSize: "14px",
              fontWeight: 500,
              animation: "slideIn 0.3s ease",
            }}
          >
            {showSuccessMessage}
          </div>
        )}

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
              onClick={fetchNotifications}
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
            ⚠️ You are viewing demo notifications. Please login to see your real
            notifications.
          </div>
        )}

        {/* Stats and Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <span
              style={{ fontSize: "20px", fontWeight: "bold", color: "#2c3e50" }}
            >
              📬 Inbox
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "#4facfe",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                {unreadCount} unread
              </span>
            )}
            {deletedCount > 0 && (
              <span
                style={{
                  background: "#6c757d",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                {deletedCount} deleted
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: "8px 20px",
                  background: "white",
                  color: "#4facfe",
                  border: "1px solid #4facfe",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4facfe";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#4facfe";
                }}
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "6px 16px",
                background: filter === "all" ? "#4facfe" : "white",
                color: filter === "all" ? "white" : "#666",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              style={{
                padding: "6px 16px",
                background: filter === "unread" ? "#4facfe" : "white",
                color: filter === "unread" ? "white" : "#666",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              style={{
                padding: "6px 16px",
                background: filter === "read" ? "#4facfe" : "white",
                color: filter === "read" ? "white" : "#666",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Read
            </button>
            <button
              onClick={() => setFilter("deleted")}
              style={{
                padding: "6px 16px",
                background: filter === "deleted" ? "#6c757d" : "white",
                color: filter === "deleted" ? "white" : "#666",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🗑️ Deleted
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
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
              No notifications
            </h2>
            <p style={{ color: "#666" }}>
              {filter !== "all"
                ? `You don't have any ${filter} notifications.`
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {filteredNotifications.map((notification) => {
              const typeStyle = getTypeColor(notification.type);
              const isLoading = actionLoading === notification.id;
              const isDeleted = notification.isDeleted === true;
              const isDeletedFilter = filter === "deleted";

              return (
                <div
                  key={notification.id}
                  style={{
                    background: isDeleted
                      ? "#e2e3e5"
                      : notification.isRead
                        ? "white"
                        : `${typeStyle.bg}`,
                    borderRadius: "16px",
                    padding: "18px 20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderLeft: isDeleted
                      ? `4px solid #6c757d`
                      : `4px solid ${typeStyle.border}`,
                    opacity: isDeleted ? 0.7 : notification.isRead ? 0.8 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(5px)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.05)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "15px", flex: 1 }}>
                      <div
                        style={{
                          fontSize: "28px",
                        }}
                      >
                        {isDeleted ? "🗑️" : getTypeIcon(notification.type)}
                      </div>
                      <div style={{ flex: 1 }}>
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
                              fontSize: "16px",
                              color: isDeleted ? "#6c757d" : "#2c3e50",
                              fontWeight: notification.isRead ? "500" : "600",
                              textDecoration: isDeleted
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && !isDeleted && (
                            <span
                              style={{
                                background: "#4facfe",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "10px",
                              }}
                            >
                              New
                            </span>
                          )}
                          {isDeleted && (
                            <span
                              style={{
                                background: "#6c757d",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "10px",
                              }}
                            >
                              Deleted
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            color: isDeleted ? "#6c757d" : "#666",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            textDecoration: isDeleted ? "line-through" : "none",
                          }}
                        >
                          {notification.message}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#999",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🕐 {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!isDeleted && !notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          disabled={isLoading}
                          style={{
                            padding: "5px 12px",
                            background: "transparent",
                            color: "#4facfe",
                            border: "1px solid #4facfe",
                            borderRadius: "15px",
                            cursor: isLoading ? "wait" : "pointer",
                            fontSize: "11px",
                            transition: "all 0.3s",
                            opacity: isLoading ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.background = "#4facfe";
                              e.currentTarget.style.color = "white";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#4facfe";
                          }}
                        >
                          {isLoading ? "⏳..." : "Mark as read"}
                        </button>
                      )}
                      {!isDeleted && !isDeletedFilter && (
                        <button
                          onClick={() => handleDeleteClick(notification.id)}
                          disabled={isLoading}
                          style={{
                            padding: "5px 10px",
                            background: "transparent",
                            color: "#999",
                            border: "none",
                            borderRadius: "15px",
                            cursor: isLoading ? "wait" : "pointer",
                            fontSize: "14px",
                            transition: "all 0.3s",
                            opacity: isLoading ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.color = "#e74c3c";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#999";
                          }}
                        >
                          🗑️
                        </button>
                      )}
                      {isDeleted && (
                        <>
                          <button
                            onClick={() =>
                              handleRestoreNotification(notification.id)
                            }
                            disabled={isLoading}
                            style={{
                              padding: "5px 12px",
                              background: "transparent",
                              color: "#28a745",
                              border: "1px solid #28a745",
                              borderRadius: "15px",
                              cursor: isLoading ? "wait" : "pointer",
                              fontSize: "11px",
                              transition: "all 0.3s",
                              opacity: isLoading ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.background = "#28a745";
                                e.currentTarget.style.color = "white";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#28a745";
                            }}
                          >
                            {isLoading ? "⏳..." : "Restore"}
                          </button>
                          <button
                            onClick={() =>
                              handlePermanentDelete(notification.id)
                            }
                            disabled={isLoading}
                            style={{
                              padding: "5px 12px",
                              background: "transparent",
                              color: "#dc3545",
                              border: "1px solid #dc3545",
                              borderRadius: "15px",
                              cursor: isLoading ? "wait" : "pointer",
                              fontSize: "11px",
                              transition: "all 0.3s",
                              opacity: isLoading ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.background = "#dc3545";
                                e.currentTarget.style.color = "white";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#dc3545";
                            }}
                          >
                            {isLoading ? "⏳..." : "Delete Permanently"}
                          </button>
                        </>
                      )}
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

      {/* Confirmation Modal for Delete */}
      {showConfirmModal && (
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
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConfirmModal(false);
              setDeleteId(null);
            }
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
            <h3 style={{ color: "#2c3e50", marginBottom: "12px" }}>
              Move to Deleted
            </h3>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Are you sure you want to move this notification to deleted?
              <br />
              <small style={{ color: "#999" }}>
                You can restore it later from the Deleted tab.
              </small>
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 24px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setDeleteId(null);
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

export default Notifications;
