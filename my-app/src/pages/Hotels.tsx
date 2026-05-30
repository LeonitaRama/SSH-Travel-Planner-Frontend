import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

import BerlinImg from "../assets/HotelAdlonKempinskiBerlin.jpg";
import LondonImg from "../assets/TheLanghamHotel.jpg";
import NYCImg from "../assets/ThePlazaHotel.jpg";
import VeniceImg from "../assets/HotelDanieliVenice.jpg";
import SavoyLondonImg from "../assets/SavoyLondon.jpg";
import MarinaBaySandsHotelSingaporeImg from "../assets/MarinaBaySandsHotel.jpg";

interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  image?: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviews: number;
  stars: number;
  amenities: string[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  distanceToCenter: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  availableRooms: number;
}

// Demo data për fallback
const getDemoHotels = (): Hotel[] => [
  {
    id: "1",
    name: "The Plaza Hotel",
    address: "768 5th Avenue",
    city: "New York",
    country: "USA",
    image: NYCImg,
    pricePerNight: 450,
    currency: "USD",
    rating: 4.8,
    reviews: 2340,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Pool",
      "Gym",
      "Room Service",
      "Bar",
      "Parking",
    ],
    description:
      "Luxury hotel located in the heart of Manhattan, overlooking Central Park.",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    distanceToCenter: "0.2 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 12,
  },
  {
    id: "2",
    name: "The Ritz Paris",
    address: "15 Place Vendôme",
    city: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    pricePerNight: 1200,
    currency: "EUR",
    rating: 4.9,
    reviews: 1890,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Pool",
      "Gym",
      "Room Service",
      "Bar",
      "Concierge",
    ],
    description:
      "Iconic palace hotel in the center of Paris, offering unparalleled luxury.",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    distanceToCenter: "0.1 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 8,
  },
  {
    id: "3",
    name: "The Savoy",
    address: "Strand",
    city: "London",
    country: "UK",
    image: SavoyLondonImg,
    pricePerNight: 550,
    currency: "GBP",
    rating: 4.7,
    reviews: 3250,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Pool",
      "Gym",
      "Room Service",
      "Bar",
      "Theatre",
    ],
    description:
      "Famous hotel on the Thames, combining Edwardian elegance with modern amenities.",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    distanceToCenter: "0 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 15,
  },
  {
    id: "4",
    name: "Hotel Adlon Kempinski",
    address: "Unter den Linden 77",
    city: "Berlin",
    country: "Germany",
    image: BerlinImg,
    pricePerNight: 380,
    currency: "EUR",
    rating: 4.6,
    reviews: 2100,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Pool",
      "Gym",
      "Room Service",
      "Bar",
    ],
    description: "Legendary hotel next to Brandenburg Gate.",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    distanceToCenter: "0.3 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 20,
  },
  {
    id: "5",
    name: "The Langham",
    address: "1c Portland Place",
    city: "London",
    country: "UK",
    image: LondonImg,
    pricePerNight: 420,
    currency: "GBP",
    rating: 4.7,
    reviews: 1780,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Pool",
      "Gym",
      "Room Service",
      "Bar",
      "Chauffeured Car",
    ],
    description:
      "Grand hotel in the West End, known for its exceptional service.",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    distanceToCenter: "0.5 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 10,
  },
  {
    id: "6",
    name: "Marina Bay Sands",
    address: "10 Bayfront Ave",
    city: "Singapore",
    country: "Singapore",
    image: MarinaBaySandsHotelSingaporeImg,
    pricePerNight: 650,
    currency: "SGD",
    rating: 4.8,
    reviews: 8900,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Infinity Pool",
      "Gym",
      "Room Service",
      "Bar",
      "Casino",
    ],
    description: "Iconic hotel with rooftop infinity pool.",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    distanceToCenter: "0 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 25,
  },
  {
    id: "7",
    name: "Hotel Danieli",
    address: "Riva degli Schiavoni",
    city: "Venice",
    country: "Italy",
    image: VeniceImg,
    pricePerNight: 520,
    currency: "EUR",
    rating: 4.7,
    reviews: 1450,
    stars: 5,
    amenities: [
      "Free WiFi",
      "Restaurant",
      "Room Service",
      "Bar",
      "Concierge",
      "Gondola Service",
    ],
    description: "Historic palace hotel overlooking the lagoon.",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    distanceToCenter: "0.1 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 14,
  },
  {
    id: "8",
    name: "Burj Al Arab",
    address: "Jumeirah Beach Road",
    city: "Dubai",
    country: "UAE",
    image:
      "https://images.unsplash.com/photo-1584132967333-10e028bd69f7?w=400&h=300&fit=crop",
    pricePerNight: 1500,
    currency: "AED",
    rating: 4.9,
    reviews: 5600,
    stars: 7,
    amenities: [
      "Free WiFi",
      "Spa",
      "Restaurant",
      "Pool",
      "Gym",
      "Room Service",
      "Bar",
      "Helicopter Pad",
    ],
    description: "World's most luxurious hotel, sail-shaped icon of Dubai.",
    checkInTime: "16:00",
    checkOutTime: "12:00",
    distanceToCenter: "5 km",
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 5,
  },
];

function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "stars">("price");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Merr token-in nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch hotels nga backend me filtra
  const fetchHotels = async () => {
    setLoading(true);
    setError("");

    try {
      // Ndërto parametrat e query
      const params: Record<string, string> = {};

      if (location) {
        // Këtu duhet të kesh një mënyrë për të kthyer location në destinationId
        // Për demo, përdorim city si filter
        params.destinationId = location;
      }
      if (minPrice > 0) {
        params.maxPrice = maxPrice.toString();
      }
      if (selectedStars.length > 0) {
        params.rating = Math.min(...selectedStars).toString();
      }

      const response = await api.get<Hotel[]>("/hotels", {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setHotels(response.data);
      } else {
        setHotels(getDemoHotels());
      }
    } catch (err: any) {
      console.error("Error fetching hotels:", err);

      if (err.response?.status === 401) {
        setError("Please login to view hotels");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view hotels");
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to server. Make sure backend is running on port 3000",
        );
      } else {
        setError(err.response?.data?.message || "Failed to load hotels");
      }

      setHotels(getDemoHotels());
    } finally {
      setLoading(false);
    }
  };

  // Ngarko të dhënat kur token ndryshon
  useEffect(() => {
    if (token) {
      fetchHotels();
    } else {
      setHotels(getDemoHotels());
      setLoading(false);
    }
  }, [token]);

  // Rifresko kur filtrat ndryshojnë
  useEffect(() => {
    if (token && hotels.length > 0) {
      fetchHotels();
    }
  }, [location, minPrice, maxPrice, selectedStars]);

  // Të gjitha qytetet unike për autocomplete
  const allLocations = [
    ...new Set(hotels.map((h) => `${h.city}, ${h.country}`)),
  ];

  // Të gjitha amenitetet e disponueshme
  const allAmenities = [...new Set(hotels.flatMap((h) => h.amenities))];

  // Mbyll dropdown kur klikon jashtë
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStarRating = (stars: number) => {
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, string> = {
      "Free WiFi": "📶",
      Spa: "💆",
      Restaurant: "🍽️",
      Pool: "🏊",
      Gym: "💪",
      "Room Service": "🍲",
      Bar: "🍸",
      Parking: "🅿️",
      Concierge: "🎯",
      Theatre: "🎭",
      "Chauffeured Car": "🚗",
      "Infinity Pool": "🏊",
      Casino: "🎰",
      "Gondola Service": "⛵",
      "Helicopter Pad": "🚁",
    };
    return icons[amenity] || "✨";
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesLocation =
      !location ||
      `${hotel.city}, ${hotel.country}`
        .toLowerCase()
        .includes(location.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      hotel.pricePerNight >= minPrice && hotel.pricePerNight <= maxPrice;
    const matchesStars =
      selectedStars.length === 0 || selectedStars.includes(hotel.stars);
    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((a) => hotel.amenities.includes(a));

    return (
      matchesLocation &&
      matchesSearch &&
      matchesPrice &&
      matchesStars &&
      matchesAmenities
    );
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === "price") return a.pricePerNight - b.pricePerNight;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "stars") return b.stars - a.stars;
    return 0;
  });

  const handleViewDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const handleBookHotel = (hotel: Hotel) => {
    alert(
      `🏨 Booking ${hotel.name}\n\nLocation: ${hotel.city}, ${hotel.country}\nPrice: $${hotel.pricePerNight} per night\nGuests: ${guests}\nCheck-in: ${checkInDate || "Not selected"}\nCheck-out: ${checkOutDate || "Not selected"}\nTotal: $${(hotel.pricePerNight * guests * (checkInDate && checkOutDate ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 1)).toLocaleString()}\n\nProceeding to payment...`,
    );
    navigate("/payments");
  };

  const handleStarFilter = (stars: number) => {
    if (selectedStars.includes(stars)) {
      setSelectedStars(selectedStars.filter((s) => s !== stars));
    } else {
      setSelectedStars([...selectedStars, stars]);
    }
  };

  const handleAmenityFilter = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setMinPrice(0);
    setMaxPrice(1000);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSearchTerm("");
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏨</div>
          <h2 style={{ color: "#666" }}>Finding the best hotels...</h2>
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
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
              ⚠️ You are viewing demo data. Please login to see real hotel
              information.
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <span>⚠️ {error}</span>
              <button
                onClick={fetchHotels}
                style={{
                  padding: "4px 12px",
                  background: "#721c24",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
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
            🏨 Find Your Perfect Hotel
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Discover amazing hotels at unbeatable prices
          </p>
        </div>

        {/* Search and Filters - i njëjtë si më parë */}
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
            {/* Location Search with Dropdown */}
            <div ref={locationRef} style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="📍 Where are you going?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocationDropdown(true)}
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                {location && (
                  <button
                    onClick={() => {
                      setLocation("");
                      setShowLocationDropdown(false);
                    }}
                    style={{
                      padding: "0 15px",
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              {showLocationDropdown && allLocations.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 10,
                    marginTop: "5px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {allLocations.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f0f0f0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      📍 {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Check-in Date */}
            <input
              type="date"
              placeholder="Check-in"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{
                padding: "14px 16px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                outline: "none",
              }}
            />

            {/* Check-out Date */}
            <input
              type="date"
              placeholder="Check-out"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split("T")[0]}
              style={{
                padding: "14px 16px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                outline: "none",
              }}
            />

            {/* Guests */}
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{
                padding: "14px 16px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                outline: "none",
                background: "white",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  👥 {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#666", fontSize: "13px" }}>
                💰 Price Range (per night)
              </span>
              <span style={{ color: "#4facfe", fontSize: "13px" }}>
                ${minPrice} - ${maxPrice}
              </span>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <input
                type="range"
                min="0"
                max="2000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="range"
                min="0"
                max="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Star Rating Filter */}
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              gap: "15px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#666", fontSize: "13px" }}>
              ⭐ Star Rating:
            </span>
            {[5, 4, 3].map((stars) => (
              <button
                key={stars}
                onClick={() => handleStarFilter(stars)}
                style={{
                  padding: "5px 15px",
                  background: selectedStars.includes(stars)
                    ? "#4facfe"
                    : "#f0f0f0",
                  color: selectedStars.includes(stars) ? "white" : "#666",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {stars} {stars === 5 ? "★★★★★" : stars === 4 ? "★★★★" : "★★★"}
              </button>
            ))}
          </div>

          {/* Amenities Filter */}
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#666", fontSize: "13px" }}>
              ✨ Amenities:
            </span>
            {allAmenities.slice(0, 6).map((amenity) => (
              <button
                key={amenity}
                onClick={() => handleAmenityFilter(amenity)}
                style={{
                  padding: "5px 12px",
                  background: selectedAmenities.includes(amenity)
                    ? "#4facfe"
                    : "#f0f0f0",
                  color: selectedAmenities.includes(amenity) ? "white" : "#666",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                {getAmenityIcon(amenity)} {amenity}
              </button>
            ))}
          </div>

          {/* Search Bar and Sort */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #eee",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search by hotel name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 2,
                padding: "12px 18px",
                border: "1px solid #ddd",
                borderRadius: "30px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ color: "#666", fontSize: "13px" }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "price" | "rating" | "stars")
                }
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "25px",
                  fontSize: "13px",
                  background: "white",
                }}
              >
                <option value="price">💰 Price (Low to High)</option>
                <option value="rating">📊 Rating (Highest)</option>
                <option value="stars">⭐ Stars (Highest)</option>
              </select>
              <button
                onClick={clearFilters}
                style={{
                  padding: "8px 20px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
          🏨 Found {sortedHotels.length} hotels
        </p>

        {/* Hotels Grid - i njëjtë si më parë */}
        {sortedHotels.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🏨</div>
            <h2 style={{ color: "#2c3e50", marginBottom: "10px" }}>
              No hotels found
            </h2>
            <p style={{ color: "#666" }}>Try adjusting your search criteria</p>
            <button
              onClick={clearFilters}
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
              Clear All Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "25px",
            }}
          >
            {sortedHotels.map((hotel) => (
              <div
                key={hotel.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
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
                onClick={() => handleViewDetails(hotel)}
              >
                {/* Hotel Image */}
                <div
                  style={{
                    height: "220px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
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
                  {/* Price Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      right: "15px",
                      background: "#4facfe",
                      color: "white",
                      padding: "8px 15px",
                      borderRadius: "25px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    ${hotel.pricePerNight}
                    <span style={{ fontSize: "11px", fontWeight: "normal" }}>
                      /night
                    </span>
                  </div>
                </div>

                {/* Hotel Info */}
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
                      style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}
                    >
                      {hotel.name}
                    </h3>
                    <span style={{ color: "#f39c12", fontSize: "14px" }}>
                      {getStarRating(hotel.stars)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#666",
                      fontSize: "13px",
                    }}
                  >
                    📍 {hotel.city}, {hotel.country}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#4facfe",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      ★ {hotel.rating}
                    </span>
                    <span style={{ color: "#999", fontSize: "12px" }}>
                      ({hotel.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "15px",
                    }}
                  >
                    {hotel.amenities.slice(0, 4).map((amenity) => (
                      <span
                        key={amenity}
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          background: "#f0f0f0",
                          borderRadius: "12px",
                          color: "#666",
                        }}
                      >
                        {getAmenityIcon(amenity)} {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span style={{ fontSize: "11px", color: "#999" }}>
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#4facfe",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
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

      {/* Modal for Hotel Details - i njëjtë si më parë */}
      {showModal && selectedHotel && (
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

            {/* Hotel Image */}
            <div
              style={{
                width: "100%",
                height: "250px",
                overflow: "hidden",
                borderRadius: "15px",
                marginBottom: "20px",
              }}
            >
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
                {selectedHotel.name}
              </h2>
              <p style={{ color: "#666", fontSize: "14px" }}>
                📍 {selectedHotel.address}, {selectedHotel.city},{" "}
                {selectedHotel.country}
              </p>
              <div style={{ marginTop: "5px" }}>
                <span style={{ color: "#f39c12", fontSize: "16px" }}>
                  {getStarRating(selectedHotel.stars)}
                </span>
                <span style={{ color: "#4facfe", marginLeft: "10px" }}>
                  ★ {selectedHotel.rating} (
                  {selectedHotel.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <h3
                style={{
                  margin: "0 0 10px 0",
                  color: "#2c3e50",
                  fontSize: "16px",
                }}
              >
                Description
              </h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                {selectedHotel.description}
              </p>
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
                Hotel Details
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    Check-in
                  </span>
                  <p style={{ fontWeight: 500, margin: 0 }}>
                    {selectedHotel.checkInTime}
                  </p>
                </div>
                <div>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    Check-out
                  </span>
                  <p style={{ fontWeight: 500, margin: 0 }}>
                    {selectedHotel.checkOutTime}
                  </p>
                </div>
                <div>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    Distance to center
                  </span>
                  <p style={{ fontWeight: 500, margin: 0 }}>
                    {selectedHotel.distanceToCenter}
                  </p>
                </div>
                <div>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    Available rooms
                  </span>
                  <p style={{ fontWeight: 500, margin: 0 }}>
                    {selectedHotel.availableRooms}
                  </p>
                </div>
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
                Amenities
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {selectedHotel.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    style={{
                      padding: "5px 12px",
                      background: "#f0f0f0",
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    {getAmenityIcon(amenity)} {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "20px",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Price per night:
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#4facfe",
                    fontSize: "24px",
                  }}
                >
                  ${selectedHotel.pricePerNight}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Guests:</span>
                <span style={{ fontWeight: 500 }}>{guests}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Free cancellation:
                </span>
                <span
                  style={{
                    fontWeight: 500,
                    color: selectedHotel.freeCancellation
                      ? "#27ae60"
                      : "#e74c3c",
                  }}
                >
                  {selectedHotel.freeCancellation ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Breakfast included:
                </span>
                <span
                  style={{
                    fontWeight: 500,
                    color: selectedHotel.breakfastIncluded
                      ? "#27ae60"
                      : "#e74c3c",
                  }}
                >
                  {selectedHotel.breakfastIncluded ? "✅ Yes" : "❌ No"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleBookHotel(selectedHotel);
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "#4facfe",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Book Now
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
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

export default Hotels;
