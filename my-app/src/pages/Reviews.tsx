import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface Review {
  id: string;
  title: string;
  comment: string;
  rating: number;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  destination: string;
  destinationId?: string;
  bookingId?: string;
  helpful: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  images?: string[];
}

function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">(
    "all",
  );
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >("latest");
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    title: "",
    comment: "",
    rating: 5,
    destination: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Merr token-in dhe emrin e përdoruesit nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName") || "Guest";
    setToken(storedToken);
    setUserName(storedUserName);
  }, []);

  // Fetch reviews nga backend
  const fetchReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<Review[]>("/reviews", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setReviews(response.data);
      } else {
        setReviews(getDemoReviews());
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);

      if (err.response?.status === 401) {
        setError("Please login to view reviews");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load reviews");
      }

      setReviews(getDemoReviews());
    } finally {
      setLoading(false);
    }
  };

  // Demo data për fallback
  const getDemoReviews = (): Review[] => [
    {
      id: "1",
      title: "Amazing experience in Paris!",
      comment:
        "The flight was comfortable and the hotel was luxurious. The Eiffel Tower view from our room was breathtaking. Highly recommend this package!",
      rating: 5,
      userName: "John Doe",
      userEmail: "john@example.com",
      destination: "Paris, France",
      helpful: 128,
      status: "approved",
      createdAt: "2024-06-20T10:30:00Z",
    },
    {
      id: "2",
      title: "Great value for money",
      comment:
        "Rome exceeded our expectations. The guided tours were informative and the food was amazing. Would definitely book again!",
      rating: 4,
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      destination: "Rome, Italy",
      helpful: 89,
      status: "approved",
      createdAt: "2024-07-15T14:20:00Z",
    },
    {
      id: "3",
      title: "Bali is paradise!",
      comment:
        "The beaches, the culture, the people - everything was perfect. Our travel package included everything we needed.",
      rating: 5,
      userName: "Michael Brown",
      userEmail: "michael@example.com",
      destination: "Bali, Indonesia",
      helpful: 245,
      status: "approved",
      createdAt: "2024-08-10T09:15:00Z",
    },
    {
      id: "4",
      title: "Good but could be better",
      comment:
        "Tokyo was amazing but the hotel was a bit far from the city center. The flight was comfortable though.",
      rating: 3,
      userName: "Emily Davis",
      userEmail: "emily@example.com",
      destination: "Tokyo, Japan",
      helpful: 34,
      status: "approved",
      createdAt: "2024-09-05T16:45:00Z",
    },
    {
      id: "5",
      title: "Luxury at its finest!",
      comment:
        "The Burj Al Arab was incredible! The service was impeccable and the views were stunning. Worth every penny.",
      rating: 5,
      userName: "David Wilson",
      userEmail: "david@example.com",
      destination: "Dubai, UAE",
      helpful: 312,
      status: "approved",
      createdAt: "2024-10-20T11:00:00Z",
    },
    {
      id: "6",
      title: "Wonderful London trip",
      comment:
        "London is beautiful! The hotel was centrally located and we could walk to most attractions.",
      rating: 4,
      userName: "Lisa Anderson",
      userEmail: "lisa@example.com",
      destination: "London, UK",
      helpful: 67,
      status: "approved",
      createdAt: "2024-11-12T13:30:00Z",
    },
    {
      id: "7",
      title: "Magical experience in Mallorca",
      comment:
        "The crystal clear waters and beautiful beaches made our vacation unforgettable. The hotel staff was very friendly.",
      rating: 5,
      userName: "Robert Martinez",
      userEmail: "robert@example.com",
      destination: "Mallorca, Spain",
      helpful: 156,
      status: "approved",
      createdAt: "2024-12-01T08:00:00Z",
    },
  ];

  // Submit new review
  const handleSubmitReview = async () => {
    setSubmitError("");

    if (!newReview.title || !newReview.comment || !newReview.destination) {
      setSubmitError("Please fill in all fields");
      return;
    }

    if (newReview.title.length < 3) {
      setSubmitError("Title must be at least 3 characters");
      return;
    }

    if (newReview.comment.length < 10) {
      setSubmitError("Review must be at least 10 characters");
      return;
    }

    setSubmitting(true);

    try {
      const userEmail = localStorage.getItem("userEmail") || "user@example.com";
      //const userRole = localStorage.getItem("userRole") || "CUSTOMER";

      const reviewData = {
        title: newReview.title,
        comment: newReview.comment,
        rating: newReview.rating,
        destination: newReview.destination,
        userName: userName,
        userEmail: userEmail,
        status: "pending" as const,
        helpful: 0,
        createdAt: new Date().toISOString(),
      };

      // Provo të dërgojë në backend
      let response;
      try {
        response = await api.post("/reviews", reviewData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "tenant-id": localStorage.getItem("tenantId") || "",
          },
        });
      } catch (apiError: any) {
        console.log("Backend not available, using demo mode");
        // Nëse backend nuk është i disponueshëm, përdor demo mode
        response = null;
      }

      if (response && response.data) {
        // Nëse backend kthen përgjigje
        setReviews([response.data, ...reviews]);
      } else {
        // Demo mode - shto review lokalisht
        const newReviewObj: Review = {
          id: `review-${Date.now()}`,
          title: newReview.title,
          comment: newReview.comment,
          rating: newReview.rating,
          userName: userName,
          userEmail: localStorage.getItem("userEmail") || "user@example.com",
          destination: newReview.destination,
          helpful: 0,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        setReviews([newReviewObj, ...reviews]);
      }

      setShowWriteReview(false);
      setNewReview({ title: "", comment: "", rating: 5, destination: "" });
      alert(
        "✅ Thank you for your review! It will be published after approval.",
      );
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (id: string) => {
    // Simulo increment të helpful count
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, helpful: review.helpful + 1 } : review,
      ),
    );

    // Provo të dërgojë në backend (nëse ekziston endpoint)
    try {
      await api.patch(
        `/reviews/${id}/helpful`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "tenant-id": localStorage.getItem("tenantId") || "",
          },
        },
      );
    } catch (err) {
      console.log("Backend helpful endpoint not available, using demo mode");
    }
  };

  // Ngarko reviews kur token ndryshon
  useEffect(() => {
    if (token) {
      fetchReviews();
    } else {
      setReviews(getDemoReviews());
      setLoading(false);
    }
  }, [token]);

  const getStarRating = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "latest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  const stats = {
    total: reviews.length,
    averageRating: (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1),
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    fourStar: reviews.filter((r) => r.rating === 4).length,
    threeStar: reviews.filter((r) => r.rating === 3).length,
    twoStar: reviews.filter((r) => r.rating === 2).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
          <h2 style={{ color: "#666" }}>Loading reviews...</h2>
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
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>⭐</div>
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            Traveler Reviews
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Read what other travelers say about their experiences
          </p>
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
              onClick={fetchReviews}
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
            ⚠️ You are viewing demo reviews. Please login to see real reviews
            and write your own.
          </div>
        )}

        {/* Stats Section */}
        <div
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "48px", color: "#f39c12" }}>⭐</div>
              <h2
                style={{ fontSize: "48px", margin: "10px 0", color: "#2c3e50" }}
              >
                {stats.averageRating}
              </h2>
              <p style={{ color: "#666" }}>Average Rating</p>
              <p style={{ color: "#999", fontSize: "12px" }}>
                Based on {stats.total} reviews
              </p>
            </div>
            <div>
              <div style={{ fontSize: "24px", marginBottom: "15px" }}>
                📊 Rating Distribution
              </div>
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  key={star}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ width: "30px", fontSize: "13px" }}>
                    {star} ★
                  </span>
                  <div
                    style={{
                      flex: 1,
                      background: "#e0e0e0",
                      borderRadius: "10px",
                      height: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: `${((stats[`${star}Star` as keyof typeof stats] as number) / stats.total) * 100}%`,
                        background: "#f39c12",
                        borderRadius: "10px",
                        height: "8px",
                      }}
                    />
                  </div>
                  <span
                    style={{ width: "40px", fontSize: "12px", color: "#666" }}
                  >
                    {stats[`${star}Star` as keyof typeof stats]}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <button
                onClick={() => setShowWriteReview(true)}
                style={{
                  padding: "14px 30px",
                  background: "#4facfe",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3a8bd9";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#4facfe";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ✍️ Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{ color: "#666", fontSize: "13px", marginRight: "5px" }}
            >
              Filter by rating:
            </span>
            {(["all", "5", "4", "3", "2", "1"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                style={{
                  padding: "6px 16px",
                  background: filter === r ? "#4facfe" : "white",
                  color: filter === r ? "white" : "#666",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {r === "all" ? "All" : `${r} ★`}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: "#666", fontSize: "13px" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: "6px 12px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                fontSize: "13px",
                background: "white",
              }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {sortedReviews.length === 0 ? (
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
              No reviews found
            </h2>
            <p style={{ color: "#666" }}>
              Be the first to share your experience!
            </p>
            <button
              onClick={() => setShowWriteReview(true)}
              style={{
                marginTop: "20px",
                padding: "10px 25px",
                background: "#4facfe",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
              }}
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "25px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateX(5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateX(0)")
                }
                onClick={() => {
                  setSelectedReview(review);
                  setShowModal(true);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "15px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          color: "#2c3e50",
                        }}
                      >
                        {review.title}
                      </h3>
                      <span style={{ color: "#f39c12", fontSize: "14px" }}>
                        {getStarRating(review.rating)}
                      </span>
                      {review.status === "pending" && (
                        <span
                          style={{
                            background: "#fff3cd",
                            color: "#856404",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "10px",
                          }}
                        >
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        color: "#666",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {review.comment.length > 150
                        ? review.comment.substring(0, 150) + "..."
                        : review.comment}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginTop: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#4facfe",
                          fontWeight: 500,
                        }}
                      >
                        📍 {review.destination}
                      </span>
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        👤 {review.userName}
                      </span>
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        📅 {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button
                      style={{
                        padding: "5px 12px",
                        background: "#f0f0f0",
                        color: "#666",
                        border: "none",
                        borderRadius: "15px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkHelpful(review.id);
                      }}
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Modal for Review Details */}
      {showModal && selectedReview && (
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

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>⭐</div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "22px" }}>
                {selectedReview.title}
              </h2>
              <div style={{ marginTop: "8px" }}>
                <span style={{ color: "#f39c12", fontSize: "18px" }}>
                  {getStarRating(selectedReview.rating)}
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <p
                style={{
                  color: "#555",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {selectedReview.comment}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <span style={{ color: "#4facfe", fontSize: "14px" }}>
                  📍 {selectedReview.destination}
                </span>
                <span style={{ color: "#666", fontSize: "14px" }}>
                  👤 {selectedReview.userName}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid #eee",
                }}
              >
                <span style={{ color: "#999", fontSize: "12px" }}>
                  📅 {formatDate(selectedReview.createdAt)}
                </span>
                <button
                  onClick={() => handleMarkHelpful(selectedReview.id)}
                  style={{
                    padding: "6px 16px",
                    background: "#f0f0f0",
                    color: "#666",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  👍 Helpful ({selectedReview.helpful})
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => setShowModal(false)}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
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
          onClick={() => {
            setShowWriteReview(false);
            setSubmitError("");
          }}
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowWriteReview(false);
                setSubmitError("");
              }}
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

            <h2
              style={{
                margin: "0 0 20px 0",
                color: "#2c3e50",
                fontSize: "24px",
                textAlign: "center",
              }}
            >
              Write a Review
            </h2>

            {/* Error Message */}
            {submitError && (
              <div
                style={{
                  background: "#f8d7da",
                  color: "#721c24",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                ❌ {submitError}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Destination *
              </label>
              <input
                type="text"
                placeholder="e.g., Paris, France"
                value={newReview.destination}
                onChange={(e) =>
                  setNewReview({ ...newReview, destination: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Title *
              </label>
              <input
                type="text"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Rating *
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    style={{
                      fontSize: "32px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: newReview.rating >= star ? "#f39c12" : "#ddd",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Review *
              </label>
              <textarea
                placeholder="Share your experience in detail..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {!token && (
              <div
                style={{
                  background: "#fff3cd",
                  color: "#856404",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                ⚠️ Please login to submit a review
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || !token}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: token
                    ? submitting
                      ? "#ccc"
                      : "#4facfe"
                    : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: token && !submitting ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                onClick={() => {
                  setShowWriteReview(false);
                  setSubmitError("");
                }}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;
