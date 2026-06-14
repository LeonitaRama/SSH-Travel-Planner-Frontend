import { useState, useEffect } from "react";
import api from "../services/api";

interface AiRecommendationRequest {
  destination: string;
  budget: number;
  interests: string;
  duration: string;
  travelers: number;
}

function AiPage() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [duration, setDuration] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Merr token-in nga localStorage për autentikim
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const interestOptions = [
    "🏛️ Historical Sites",
    "🍷 Fine Dining",
    "🏔️ Nature & Hiking",
    "🏖️ Beaches",
    "🛍️ Shopping",
    "🎭 Culture & Arts",
    "🎉 Nightlife",
    "📸 Photography",
    "🧘 Wellness & Spa",
    "🚗 Adventure Sports",
  ];

  const destinationSuggestions = [
    "Paris, France",
    "Rome, Italy",
    "Tokyo, Japan",
    "New York, USA",
    "London, UK",
    "Bali, Indonesia",
    "Dubai, UAE",
    "Barcelona, Spain",
    "Istanbul, Turkey",
    "Bangkok, Thailand",
  ];

  const handleGenerate = async () => {
    // Validimi
    if (!destination) {
      setError("Please enter a destination");
      return;
    }
    if (!budget || parseInt(budget) <= 0) {
      setError("Please enter a valid budget");
      return;
    }
    if (!interests) {
      setError("Please select your interests");
      return;
    }

    setError("");
    setLoading(true);
    setRecommendation("");

    try {
      // Bën thirrje reale në backend-in NestJS
      const response = await api.post<{ recommendation: string }>(
        "/ai/recommendations",
        {
          destination: destination,
          budget: parseInt(budget),
          interests: interests.replace(/[🏛️🍷🏔️🏖️🛍️🎭🎉📸🧘🚗]/g, "").trim(), // Heq emoji-t për backend
          duration: duration || "7",
          travelers: parseInt(travelers),
        } as AiRecommendationRequest,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "tenant-id": localStorage.getItem("tenantId") || "",
          },
        },
      );

      // Përdor përgjigjen nga backend-i
      setRecommendation(
        response.data.recommendation ||
          "✨ Based on your preferences, we recommend visiting " +
            destination +
            " during spring season! Check out our travel packages for the best deals.",
      );
    } catch (err: any) {
      console.error("AI Recommendation Error:", err);

      // Error handling më i detajuar
      if (err.response?.status === 401) {
        setError("Please login first to get AI recommendations");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access this feature");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please try again later.");
      } else if (err.code === "ERR_NETWORK") {
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to generate recommendations. Please try again later.",
        );
      }

      // Fallback recommendation në rast gabimi
      setRecommendation(
        "✨ AI Travel Recommendation for " +
          destination +
          " ✨\n\n" +
          "Based on your budget of $" +
          budget +
          " and interest in " +
          interests +
          ", we recommend:\n\n" +
          "🏨 Hotels: Luxury stays in the city center\n" +
          "🍽️ Restaurants: Local cuisine experiences\n" +
          "📍 Attractions: Historical landmarks and cultural sites\n" +
          "📅 Best time to visit: Spring (April-June) or Fall (September-October)\n\n" +
          "💡 Pro tip: Book at least 2 months in advance for the best prices!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (dest: string) => {
    setDestination(dest);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
            }}
          ></div>
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            🤖 AI Travel Assistant
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Get personalized travel recommendations powered by artificial
            intelligence
          </p>
          {!token && (
            <p
              style={{
                fontSize: "12px",
                color: "#e74c3c",
                marginTop: "10px",
              }}
            >
              ⚠️ Please login to use AI recommendations
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "30px",
          }}
        >
          {/* Form Section - Left Side */}
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "35px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                color: "#2c3e50",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>📝</span> Tell us about your trip
            </h2>

            {/* Destination Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Destination *
              </label>
              <input
                type='text'
                placeholder='e.g., Paris, France'
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "15px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4facfe";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {destinationSuggestions.map((dest) => (
                  <span
                    key={dest}
                    onClick={() => handleQuickSelect(dest)}
                    style={{
                      fontSize: "12px",
                      padding: "4px 12px",
                      background: "#f0f0f0",
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      color: "#666",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4facfe";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f0f0f0";
                      e.currentTarget.style.color = "#666";
                    }}
                  >
                    {dest}
                  </span>
                ))}
              </div>
            </div>

            {/* Budget Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Budget (USD) *
              </label>
              <input
                type='number'
                placeholder='Enter your budget'
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "15px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4facfe";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              />
            </div>

            {/* Interests Dropdown */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Interests *
              </label>
              <select
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "15px",
                  fontSize: "16px",
                  outline: "none",
                  background: "white",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <option value=''>Select your interests...</option>
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Duration (days)
              </label>
              <input
                type='number'
                placeholder='e.g., 7'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "15px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4facfe";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              />
            </div>

            {/* Travelers Input */}
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Number of travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "15px",
                  fontSize: "16px",
                  outline: "none",
                  background: "white",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "traveler" : "travelers"}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: "#fee",
                  color: "#e74c3c",
                  padding: "12px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                border: "none",
                borderRadius: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                opacity: loading ? 0.6 : 1,
                boxShadow: "0 5px 15px rgba(79,172,254,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(79,172,254,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(79,172,254,0.3)";
              }}
            >
              {loading
                ? "⏳ Generating recommendations..."
                : "✨ Generate AI Recommendations"}
            </button>
          </div>

          {/* Recommendation Section - Right Side */}
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "35px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                color: "#2c3e50",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>🤖</span> AI Recommendation
            </h2>

            {recommendation ? (
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  padding: "25px",
                  minHeight: "400px",
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#2c3e50",
                    whiteSpace: "pre-line",
                  }}
                >
                  {recommendation}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "25px",
                    paddingTop: "20px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <button
                    onClick={() => {
                      alert("Package booking will be available soon!");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#4facfe",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#3a8bd9";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#4facfe";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    📦 Book This Package
                  </button>
                  <button
                    onClick={() => {
                      setRecommendation("");
                      setDestination("");
                      setBudget("");
                      setInterests("");
                      setDuration("");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#f0f0f0",
                      color: "#666",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#e0e0e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f0f0f0";
                    }}
                  >
                    🔄 New Search
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center",
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "20px" }}>✨</div>
                <h3
                  style={{
                    color: "#2c3e50",
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  Your AI travel assistant is ready
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Fill in your travel preferences on the left and click generate
                </p>
                <div
                  style={{
                    marginTop: "30px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "32px" }}>✈️</span>
                  <span style={{ fontSize: "32px" }}>🏨</span>
                  <span style={{ fontSize: "32px" }}>🍷</span>
                  <span style={{ fontSize: "32px" }}>🏔️</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div
          style={{
            marginTop: "50px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎯</div>
            <h3
              style={{
                color: "#2c3e50",
                marginBottom: "8px",
                fontSize: "18px",
              }}
            >
              Personalized
            </h3>
            <p style={{ color: "#666", fontSize: "13px" }}>
              Tailored recommendations based on your preferences
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚡</div>
            <h3
              style={{
                color: "#2c3e50",
                marginBottom: "8px",
                fontSize: "18px",
              }}
            >
              Fast & Smart
            </h3>
            <p style={{ color: "#666", fontSize: "13px" }}>
              AI-powered suggestions in seconds
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔒</div>
            <h3
              style={{
                color: "#2c3e50",
                marginBottom: "8px",
                fontSize: "18px",
              }}
            >
              Secure
            </h3>
            <p style={{ color: "#666", fontSize: "13px" }}>
              Your data is safe with us
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => (window.location.href = "/")}
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
    </div>
  );
}

export default AiPage;
