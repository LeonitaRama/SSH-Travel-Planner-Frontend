import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import BaliImg from "../assets/balii.jpg";
import ParisImg from "../assets/pariss.jpg";
import TokyoImg from "../assets/Tokyoo.jpg";
import RomeImg from "../assets/Romee.jpg";
import DubaiImg from "../assets/Dubaiii.jpg";
import SantoriniImg from "../assets/santorini.jpg";

interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  destinationId?: string;
  duration: number;
  price: number;
  currency: string;
  discount: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  images: string[];
  availableDates: string[];
  availableSpots: number;
  rating: number;
  reviews: number;
  isPopular: boolean;
  isFeatured: boolean;
  createdAt: string;
}

function TravelPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "popular" | "featured">("all");
  const [sortBy, setSortBy] = useState<"price" | "duration" | "rating">(
    "price",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [duration, setDuration] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  // Merr token-in nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch travel packages nga backend
  const fetchPackages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<TravelPackage[]>("/travel-packages", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setPackages(response.data);
      } else {
        setPackages(getDemoPackages());
      }
    } catch (err: any) {
      console.error("Error fetching travel packages:", err);

      if (err.response?.status === 401) {
        setError("Please login to view travel packages");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(
          err.response?.data?.message || "Failed to load travel packages",
        );
      }

      setPackages(getDemoPackages());
    } finally {
      setLoading(false);
    }
  };

  // Demo data për fallback
  const getDemoPackages = (): TravelPackage[] => [
    {
      id: "1",
      name: "Paris Romance Package",
      destination: "Paris, France",
      duration: 7,
      price: 1899,
      currency: "USD",
      discount: 15,
      description:
        "Experience the magic of Paris with this romantic getaway. Includes Eiffel Tower visit, Seine river cruise, and guided tours of Louvre Museum.",
      highlights: [
        "Eiffel Tower Visit",
        "Seine River Cruise",
        "Louvre Museum Tour",
        "Wine Tasting",
      ],
      inclusions: [
        "5 nights hotel",
        "Breakfast daily",
        "Airport transfers",
        "City tour guide",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Lunches & dinners",
      ],
      images: [ParisImg],
      availableDates: ["2024-06-15", "2024-07-01", "2024-08-10"],
      availableSpots: 12,
      rating: 4.8,
      reviews: 234,
      isPopular: true,
      isFeatured: true,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Bali Paradise Escape",
      destination: "Bali, Indonesia",
      duration: 10,
      price: 1599,
      currency: "USD",
      discount: 10,
      description:
        "Discover the beauty of Bali with this tropical paradise package. Includes beach resorts, temple tours, and relaxation spa treatments.",
      highlights: [
        "Beach Resorts",
        "Temple Tours",
        "Spa Treatments",
        "Rice Terrace Visit",
      ],
      inclusions: [
        "9 nights hotel",
        "Daily breakfast",
        "Spa treatment",
        "Water sports activities",
      ],
      exclusions: ["International flights", "Visa fees", "Personal expenses"],
      images: [BaliImg],
      availableDates: ["2024-07-05", "2024-08-15", "2024-09-20"],
      availableSpots: 8,
      rating: 4.9,
      reviews: 456,
      isPopular: true,
      isFeatured: true,
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Tokyo Explorer",
      destination: "Tokyo, Japan",
      duration: 8,
      price: 2299,
      currency: "USD",
      discount: 0,
      description:
        "Explore the vibrant city of Tokyo with this comprehensive package. Visit ancient temples, modern skyscrapers, and enjoy authentic Japanese cuisine.",
      highlights: [
        "Shibuya Crossing",
        "Senso-ji Temple",
        "Mount Fuji Day Trip",
        "Sushi Making Class",
      ],
      inclusions: [
        "7 nights hotel",
        "Breakfast daily",
        "Tokyo Metro Pass",
        "Guide services",
      ],
      exclusions: [
        "International flights",
        "Lunch & dinner",
        "Travel insurance",
      ],
      images: [TokyoImg],
      availableDates: ["2024-08-01", "2024-09-10", "2024-10-05"],
      availableSpots: 15,
      rating: 4.7,
      reviews: 189,
      isPopular: false,
      isFeatured: true,
      createdAt: "2024-02-01",
    },
    {
      id: "4",
      name: "Italian Dream",
      destination: "Rome, Italy",
      duration: 12,
      price: 2799,
      currency: "USD",
      discount: 20,
      description:
        "Live the Italian dream with visits to Rome, Florence, and Venice. Includes guided tours of Colosseum, Vatican, and gondola rides.",
      highlights: [
        "Colosseum Tour",
        "Vatican Museums",
        "Gondola Ride",
        "Tuscany Wine Tour",
      ],
      inclusions: [
        "11 nights hotels",
        "Breakfast daily",
        "Train transfers",
        "City tours",
      ],
      exclusions: ["International flights", "Travel insurance", "Some meals"],
      images: [RomeImg],
      availableDates: ["2024-09-01", "2024-10-15"],
      availableSpots: 6,
      rating: 4.9,
      reviews: 567,
      isPopular: true,
      isFeatured: true,
      createdAt: "2024-01-10",
    },
    {
      id: "5",
      name: "Dubai Luxury Getaway",
      destination: "Dubai, UAE",
      duration: 6,
      price: 1999,
      currency: "USD",
      discount: 5,
      description:
        "Experience luxury in Dubai with this premium package. Includes Burj Khalifa visit, desert safari, and shopping tours.",
      highlights: [
        "Burj Khalifa",
        "Desert Safari",
        "Dubai Mall",
        "Creek Cruise",
      ],
      inclusions: [
        "5 nights hotel",
        "Breakfast daily",
        "Airport transfers",
        "City tour",
      ],
      exclusions: [
        "International flights",
        "Lunch & dinner",
        "Shopping expenses",
      ],
      images: [DubaiImg],
      availableDates: ["2024-10-01", "2024-11-15", "2024-12-10"],
      availableSpots: 10,
      rating: 4.8,
      reviews: 321,
      isPopular: false,
      isFeatured: false,
      createdAt: "2024-02-15",
    },
    {
      id: "6",
      name: "Greek Island Hopping",
      destination: "Santorini, Greece",
      duration: 9,
      price: 1899,
      currency: "USD",
      discount: 15,
      description:
        "Island hop through the beautiful Greek islands. Visit Santorini, Mykonos, and Crete with this unforgettable package.",
      highlights: [
        "Santorini Sunset",
        "Mykonos Beaches",
        "Crete History",
        "Boat Tours",
      ],
      inclusions: [
        "8 nights hotels",
        "Breakfast daily",
        "Ferry transfers",
        "Island tours",
      ],
      exclusions: ["International flights", "Travel insurance", "Some meals"],
      images: [SantoriniImg],
      availableDates: ["2024-07-20", "2024-08-25", "2024-09-15"],
      availableSpots: 14,
      rating: 4.9,
      reviews: 412,
      isPopular: true,
      isFeatured: true,
      createdAt: "2024-01-25",
    },
  ];

  // Ngarko packages kur token ndryshon
  useEffect(() => {
    if (token) {
      fetchPackages();
    } else {
      setPackages(getDemoPackages());
      setLoading(false);
    }
  }, [token]);

  const getPriceAfterDiscount = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const filteredPackages = packages.filter((pkg) => {
    if (filter === "popular" && !pkg.isPopular) return false;
    if (filter === "featured" && !pkg.isFeatured) return false;
    if (
      searchTerm &&
      !pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (pkg.price < minPrice || pkg.price > maxPrice) return false;
    if (duration && pkg.duration !== duration) return false;
    return true;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortBy === "price")
      return (
        getPriceAfterDiscount(a.price, a.discount) -
        getPriceAfterDiscount(b.price, b.discount)
      );
    if (sortBy === "duration") return a.duration - b.duration;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleViewDetails = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleBookPackage = (pkg: TravelPackage) => {
    alert(
      `✈️ Booking ${pkg.name}\n\nDestination: ${pkg.destination}\nDuration: ${pkg.duration} days\nPrice: $${getPriceAfterDiscount(pkg.price, pkg.discount).toLocaleString()}\n\nProceeding to payment...`,
    );
    navigate("/payments");
  };

  const durations = [3, 5, 7, 8, 9, 10, 12, 14];

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
          <h2 style={{ color: "#666" }}>Finding amazing travel packages...</h2>
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
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✈️🌍</div>
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            Travel Packages
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Discover amazing all-inclusive travel packages at unbeatable prices
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
              onClick={fetchPackages}
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
            ⚠️ You are viewing demo travel packages. Please login to see real
            packages and book.
          </div>
        )}

        {/* Search and Filters */}
        <div
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search by destination or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                background: "white",
              }}
            >
              <option value="all">All Packages</option>
              <option value="popular">🔥 Popular</option>
              <option value="featured">⭐ Featured</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                background: "white",
              }}
            >
              <option value="price">Price (Low to High)</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="rating">Rating (Highest)</option>
            </select>
            <select
              value={duration || ""}
              onChange={(e) =>
                setDuration(e.target.value ? Number(e.target.value) : null)
              }
              style={{
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                background: "white",
              }}
            >
              <option value="">Any Duration</option>
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label
              style={{
                color: "#666",
                fontSize: "13px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Price Range: ${minPrice} - ${maxPrice}
            </label>
            <div style={{ display: "flex", gap: "15px" }}>
              <input
                type="range"
                min="0"
                max="5000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="range"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
          ✈️ Found {sortedPackages.length} travel packages
        </p>

        {/* Packages Grid */}
        {sortedPackages.length === 0 ? (
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
              No packages found
            </h2>
            <p style={{ color: "#666" }}>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "25px",
            }}
          >
            {sortedPackages.map((pkg) => {
              const discountedPrice = getPriceAfterDiscount(
                pkg.price,
                pkg.discount,
              );
              return (
                <div
                  key={pkg.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 20px rgba(0,0,0,0.08)";
                  }}
                  onClick={() => handleViewDetails(pkg)}
                >
                  {/* Discount Badge */}
                  {pkg.discount > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        left: "15px",
                        background: "#e74c3c",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      {pkg.discount}% OFF
                    </div>
                  )}
                  {/* Popular/Featured Badges */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      display: "flex",
                      gap: "8px",
                      zIndex: 2,
                    }}
                  >
                    {pkg.isPopular && (
                      <span
                        style={{
                          background: "#f39c12",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                        }}
                      >
                        🔥 Popular
                      </span>
                    )}
                    {pkg.isFeatured && (
                      <span
                        style={{
                          background: "#4facfe",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                        }}
                      >
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      height: "220px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>

                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          color: "#2c3e50",
                        }}
                      >
                        {pkg.name}
                      </h3>
                      <span style={{ color: "#f39c12", fontSize: "14px" }}>
                        ★ {pkg.rating}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      📍 {pkg.destination}
                    </p>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      📅 {pkg.duration} days • {pkg.availableSpots} spots left
                    </p>
                    <p
                      style={{
                        margin: "0 0 15px 0",
                        color: "#888",
                        fontSize: "13px",
                        lineHeight: "1.4",
                      }}
                    >
                      {pkg.description.substring(0, 100)}...
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {pkg.discount > 0 ? (
                          <>
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#999",
                                textDecoration: "line-through",
                              }}
                            >
                              ${pkg.price.toLocaleString()}
                            </span>
                            <p
                              style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#e74c3c",
                                margin: 0,
                              }}
                            >
                              ${discountedPrice.toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "#4facfe",
                              margin: 0,
                            }}
                          >
                            ${pkg.price.toLocaleString()}
                          </p>
                        )}
                        <span style={{ fontSize: "11px", color: "#999" }}>
                          per person
                        </span>
                      </div>
                      <button
                        style={{
                          padding: "8px 20px",
                          background: "#4facfe",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#3a8bd9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#4facfe")
                        }
                      >
                        View Details →
                      </button>
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

      {/* Modal for Package Details */}
      {showModal && selectedPackage && (
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
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
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
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>✈️</div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
                {selectedPackage.name}
              </h2>
              <p style={{ color: "#666", fontSize: "14px" }}>
                {selectedPackage.destination}
              </p>
              <div style={{ marginTop: "8px" }}>
                <span style={{ color: "#f39c12", fontSize: "16px" }}>
                  ★ {selectedPackage.rating}
                </span>
                <span
                  style={{ color: "#999", fontSize: "13px", marginLeft: "8px" }}
                >
                  ({selectedPackage.reviews} reviews)
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                Description
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {selectedPackage.description}
              </p>

              <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                Highlights
              </h3>
              <ul
                style={{
                  margin: "0 0 20px 0",
                  paddingLeft: "20px",
                  color: "#666",
                }}
              >
                {selectedPackage.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      color: "#2c3e50",
                      fontSize: "16px",
                    }}
                  >
                    ✅ Inclusions
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "20px",
                      color: "#666",
                      fontSize: "13px",
                    }}
                  >
                    {selectedPackage.inclusions.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      color: "#2c3e50",
                      fontSize: "16px",
                    }}
                  >
                    ❌ Exclusions
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "20px",
                      color: "#666",
                      fontSize: "13px",
                    }}
                  >
                    {selectedPackage.exclusions.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                Available Dates
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {selectedPackage.availableDates.map((date) => (
                  <span
                    key={date}
                    style={{
                      padding: "5px 12px",
                      background: "#f0f0f0",
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  <div>
                    {selectedPackage.discount > 0 ? (
                      <>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#999",
                            textDecoration: "line-through",
                          }}
                        >
                          ${selectedPackage.price.toLocaleString()}
                        </span>
                        <p
                          style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#e74c3c",
                            margin: 0,
                          }}
                        >
                          $
                          {getPriceAfterDiscount(
                            selectedPackage.price,
                            selectedPackage.discount,
                          ).toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p
                        style={{
                          fontSize: "32px",
                          fontWeight: "bold",
                          color: "#4facfe",
                          margin: 0,
                        }}
                      >
                        ${selectedPackage.price.toLocaleString()}
                      </p>
                    )}
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      per person
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleBookPackage(selectedPackage);
                    }}
                    style={{
                      padding: "14px 35px",
                      background: "#4facfe",
                      color: "white",
                      border: "none",
                      borderRadius: "30px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelPackages;
