import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Ngarko të dhënat e ruajtura
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validimi
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      // Ruaj token-in dhe të dhënat në localStorage
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("refreshToken", res.data.refresh_token);
        localStorage.setItem(
          "userRole",
          res.data.user?.role || res.data.role || "User",
        );
        localStorage.setItem(
          "userName",
          res.data.user?.username ||
            res.data.user?.email?.split("@")[0] ||
            "User",
        );
      }

      // Ruaj të dhënat në context
      login(res.data);

      navigate("/");
    } catch (err: any) {
      console.log("=== DEBUG LOGIN ERROR ===");
      console.log("Error:", err);
      console.log("Response status:", err.response?.status);
      console.log("Response data:", err.response?.data);
      console.log("=========================");

      // Trajto llojet e ndryshme të gabimeve
      if (err.code === "ERR_NETWORK") {
        setError(
          "❌ Cannot connect to server.\nMake sure backend is running on http://localhost:3000",
        );
      } else if (err.response?.status === 401) {
        setError(
          "❌ Invalid email or password.\nPlease check your credentials and try again.",
        );
      } else if (err.response?.status === 404) {
        setError(
          "❌ Login endpoint not found.\nCheck if backend has /auth/login endpoint.",
        );
      } else if (err.response?.status === 400) {
        setError(`❌ ${err.response.data?.message || "Invalid data"}`);
      } else if (err.response?.status === 500) {
        setError(
          "❌ Server error.\nPlease try again later or contact support.",
        );
      } else if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ Login failed.\nPlease try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#e0e5ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#e0e5ec",
          borderRadius: "40px",
          padding: "32px",
          boxShadow: "9px 9px 16px #b8bec8, -9px -9px 16px #ffffff",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 16px auto",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "inset 5px 5px 10px #b8bec8, inset -5px -5px 10px #ffffff",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c3e50"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2c3e50",
              marginBottom: "6px",
            }}
          >
            Travel Planner
          </h1>
          <p style={{ color: "#7e8c9e", fontSize: "14px" }}>
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                color: "#2c3e50",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "6px",
                marginLeft: "8px",
              }}
            >
              📧 Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#e0e5ec",
                border: "none",
                borderRadius: "16px",
                fontSize: "14px",
                color: "#2c3e50",
                boxShadow:
                  "inset 3px 3px 6px #b8bec8, inset -3px -3px 6px #ffffff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                color: "#2c3e50",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "6px",
                marginLeft: "8px",
              }}
            >
              🔒 Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "45px",
                  background: "#e0e5ec",
                  border: "none",
                  borderRadius: "16px",
                  fontSize: "14px",
                  color: "#2c3e50",
                  boxShadow:
                    "inset 3px 3px 6px #b8bec8, inset -3px -3px 6px #ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: 0,
                }}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "rgba(231, 76, 60, 0.1)",
                borderRadius: "14px",
                padding: "12px",
                marginBottom: "16px",
                whiteSpace: "pre-line",
              }}
            >
              <p
                style={{
                  color: "#e74c3c",
                  fontSize: "13px",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#e0e5ec",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#2c3e50",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "6px 6px 12px #b8bec8, -6px -6px 12px #ffffff",
              transition: "all 0.3s ease",
              opacity: loading ? 0.5 : 1,
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "3px 3px 8px #b8bec8, -3px -3px 8px #ffffff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "6px 6px 12px #b8bec8, -6px -6px 12px #ffffff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? <span>⏳ Logging in...</span> : <span>🔐 LOGIN</span>}
          </button>
        </form>
      </div>

      {/* Decorative dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "24px",
          position: "absolute",
          bottom: "25px",
          left: 0,
          right: 0,
        }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "rgba(44, 62, 80, 0.2)",
            boxShadow: "1px 1px 2px #b8bec8, -1px -1px 2px #ffffff",
          }}
        ></div>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "rgba(44, 62, 80, 0.4)",
            boxShadow: "1px 1px 2px #b8bec8, -1px -1px 2px #ffffff",
          }}
        ></div>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "rgba(44, 62, 80, 0.6)",
            boxShadow: "1px 1px 2px #b8bec8, -1px -1px 2px #ffffff",
          }}
        ></div>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "rgba(44, 62, 80, 0.8)",
            boxShadow: "1px 1px 2px #b8bec8, -1px -1px 2px #ffffff",
          }}
        ></div>
      </div>
    </div>
  );
}
