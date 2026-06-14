import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import TheSavoyRoom from "../assets/TheSavoyRoom.jpg";
import GrandHotelNYCRoom from "../assets/GrandHotelNYCRoom.jpg";
import NYCHotelRoom from "../assets/NYCHotelRoom.jpg";
import ParisHotelRoom from "../assets/ParisHotelRoom.jpg";
import DubaiHotelRoom from "../assets/DubaiHotelRoom.jpg";
import RomeHotelRoom from "../assets/RomeHotelRoom.jpg";

interface Room {
  id: string;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite" | "presidential";
  pricePerNight: number;
  currency: string;
  capacity: number;
  bedType: string;
  size: number;
  view: "city" | "sea" | "mountain" | "garden" | "pool";
  amenities: string[];
  description: string;
  image?: string;
  isAvailable: boolean;
  floor: number;
  hasWifi: boolean;
  hasAC: boolean;
  hasTV: boolean;
  hasMiniBar: boolean;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  rating: number;
  reviews: number;
}

function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "all" | "standard" | "deluxe" | "suite" | "presidential"
  >("all");
  const [sortBy, setSortBy] = useState<"price" | "capacity" | "size">("price");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roomToBook, setRoomToBook] = useState<Room | null>(null);
  const [nights, setNights] = useState(1);

  // Merr token-in nga localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch rooms nga backend
  const fetchRooms = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<Room[]>("/rooms", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setRooms(response.data);
      } else {
        setRooms(getDemoRooms());
      }
    } catch (err: any) {
      console.error("Error fetching rooms:", err);

      if (err.response?.status === 401) {
        setError("Please login to view rooms");
      } else if (err.code === "ERR_NETWORK") {
      } else {
        setError(err.response?.data?.message || "Failed to load rooms");
      }

      setRooms(getDemoRooms());
    } finally {
      setLoading(false);
    }
  };

  // Demo data për fallback - Të gjitha dhomat të disponueshme
  const getDemoRooms = (): Room[] => [
    {
      id: "1",
      roomNumber: "101",
      type: "standard",
      pricePerNight: 150,
      currency: "USD",
      capacity: 2,
      bedType: "Queen",
      size: 25,
      view: "city",
      amenities: ["Free WiFi", "TV", "Air Conditioning", "Mini Bar"],
      description:
        "Comfortable standard room with city view. Perfect for solo travelers or couples.",
      image: GrandHotelNYCRoom,
      isAvailable: true,
      floor: 1,
      hasWifi: true,
      hasAC: true,
      hasTV: true,
      hasMiniBar: true,
      hotelId: "hotel1",
      hotelName: "Grand Hotel",
      hotelCity: "New York",
      rating: 4.5,
      reviews: 128,
    },
    {
      id: "2",
      roomNumber: "202",
      type: "deluxe",
      pricePerNight: 250,
      currency: "USD",
      capacity: 3,
      bedType: "King",
      size: 35,
      view: "sea",
      amenities: [
        "Free WiFi",
        "TV",
        "Air Conditioning",
        "Mini Bar",
        "Breakfast Included",
        "Bathtub",
      ],
      description:
        "Spacious deluxe room with sea view. Includes breakfast and premium amenities.",
      image: NYCHotelRoom,
      isAvailable: true,
      floor: 2,
      hasWifi: true,
      hasAC: true,
      hasTV: true,
      hasMiniBar: true,
      hotelId: "hotel1",
      hotelName: "Grand Hotel",
      hotelCity: "New York",
      rating: 4.7,
      reviews: 89,
    },
    {
      id: "3",
      roomNumber: "305",
      type: "suite",
      pricePerNight: 450,
      currency: "USD",
      capacity: 4,
      bedType: "King + Sofa",
      size: 55,
      view: "sea",
      amenities: [
        "Free WiFi",
        "TV",
        "Air Conditioning",
        "Mini Bar",
        "Breakfast",
        "Spa Access",
        "Living Room",
        "Kitchen",
      ],
      description:
        "Luxury suite with separate living room and kitchen. Perfect for families.",
      image: ParisHotelRoom,
      isAvailable: true,
      floor: 3,
      hasWifi: true,
      hasAC: true,
      hasTV: true,
      hasMiniBar: true,
      hotelId: "hotel2",
      hotelName: "The Plaza",
      hotelCity: "Paris",
      rating: 4.9,
      reviews: 56,
    },
    {
      id: "4",
      roomNumber: "401",
      type: "presidential",
      pricePerNight: 1200,
      currency: "USD",
      capacity: 6,
      bedType: "2 Kings",
      size: 120,
      view: "sea",
      amenities: [
        "Free WiFi",
        "TV",
        "Air Conditioning",
        "Mini Bar",
        "Breakfast",
        "Spa",
        "Butler Service",
        "Private Pool",
        "Helicopter Pad",
      ],
      description:
        "The ultimate luxury experience. Presidential suite with butler service and private pool.",
      image: DubaiHotelRoom,
      isAvailable: true, // Ndryshuar nga false në true
      floor: 4,
      hasWifi: true,
      hasAC: true,
      hasTV: true,
      hasMiniBar: true,
      hotelId: "hotel3",
      hotelName: "Burj Al Arab",
      hotelCity: "Dubai",
      rating: 5.0,
      reviews: 34,
    },
    {
      id: "5",
      roomNumber: "108",
      type: "standard",
      pricePerNight: 120,
      currency: "USD",
      capacity: 2,
      bedType: "Double",
      size: 22,
      view: "garden",
      amenities: ["Free WiFi", "TV", "Air Conditioning"],
      description:
        "Cozy standard room with garden view. Great value for money.",
      image: TheSavoyRoom,
      isAvailable: true,
      floor: 1,
      hasWifi: true,
      hasAC: true,
      hasTV: true,
      hasMiniBar: false,
      hotelId: "hotel4",
      hotelName: "The Savoy",
      hotelCity: "London",
      rating: 4.3,
      reviews: 212,
    },
    {
      id: "6",
      roomNumber: "210",
      type: "deluxe",
      pricePerNight: 280,
      currency: "USD",
      capacity: 3,
      bedType: "King",
      size: 40,
      view: "mountain",
      amenities: ["Free WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"],
      description:
        "Deluxe room with breathtaking mountain views and private balcony.",
      image: RomeHotelRoom,
      isAvailable: true,
      floor: 2,
      hasWifi: true,
      hasAC: true,
      hasTV: true,
      hasMiniBar: true,
      hotelId: "hotel5",
      hotelName: "The Ritz",
      hotelCity: "Rome",
      rating: 4.6,
      reviews: 103,
    },
  ];

  // Ngarko rooms kur token ndryshon
  useEffect(() => {
    if (token) {
      fetchRooms();
    } else {
      setRooms(getDemoRooms());
      setLoading(false);
    }
  }, [token]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "standard":
        return "🛏️";
      case "deluxe":
        return "✨";
      case "suite":
        return "👑";
      case "presidential":
        return "💎";
      default:
        return "🛏️";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "standard":
        return { bg: "#d4edda", color: "#155724", text: "Standard" };
      case "deluxe":
        return { bg: "#cce5ff", color: "#004085", text: "Deluxe" };
      case "suite":
        return { bg: "#fff3cd", color: "#856404", text: "Suite" };
      case "presidential":
        return { bg: "#f8d7da", color: "#721c24", text: "Presidential" };
      default:
        return { bg: "#e2e3e5", color: "#383d41", text: "Standard" };
    }
  };

  const getViewIcon = (view: string) => {
    switch (view) {
      case "sea":
        return "🌊";
      case "mountain":
        return "🏔️";
      case "city":
        return "🌆";
      case "garden":
        return "🌿";
      case "pool":
        return "🏊";
      default:
        return "🏙️";
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filter !== "all" && room.type !== filter) return false;
    if (room.pricePerNight < minPrice || room.pricePerNight > maxPrice)
      return false;
    if (
      selectedAmenities.length > 0 &&
      !selectedAmenities.every((a) => room.amenities.includes(a))
    )
      return false;
    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "price") return a.pricePerNight - b.pricePerNight;
    if (sortBy === "capacity") return b.capacity - a.capacity;
    if (sortBy === "size") return b.size - a.size;
    return 0;
  });

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleBookClick = (room: Room) => {
    setRoomToBook(room);
    setNights(1);
    setShowConfirmModal(true);
  };

  const confirmBooking = () => {
    if (!roomToBook) return;

    setShowConfirmModal(false);

    const totalAmount = roomToBook.pricePerNight * nights;

    // Dërgo te Payments me të dhënat e dhomës
    navigate("/payments", {
      state: {
        paymentData: {
          amount: totalAmount,
          title: `${roomToBook.type.charAt(0).toUpperCase() + roomToBook.type.slice(1)} Room - ${roomToBook.hotelName}`,
          type: "hotel",
          destination: roomToBook.hotelCity,
          image: roomToBook.image,
          bookingId: `ROOM-${roomToBook.id}-${Date.now()}`,
          description: `${roomToBook.type} room #${roomToBook.roomNumber} at ${roomToBook.hotelName}, ${roomToBook.hotelCity}. ${roomToBook.description} (${nights} night${nights > 1 ? "s" : ""})`,
        },
      },
    });
  };

  const handleAmenityFilter = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const allAmenities = [...new Set(rooms.flatMap((r) => r.amenities))].slice(
    0,
    8,
  );

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛏️</div>
          <h2 style={{ color: "#666" }}>Finding the best rooms...</h2>
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
            Available Rooms
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Find the perfect room for your stay at the best hotels worldwide
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
              onClick={fetchRooms}
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
            ⚠️ You are viewing demo rooms. Please login to see real room
            availability.
          </div>
        )}

        {/* Filters */}
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
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#666",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                Room Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                <option value='all'>All Types</option>
                <option value='standard'>Standard</option>
                <option value='deluxe'>Deluxe</option>
                <option value='suite'>Suite</option>
                <option value='presidential'>Presidential</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#666",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                <option value='price'>Price (Low to High)</option>
                <option value='capacity'>Capacity (High to Low)</option>
                <option value='size'>Size (High to Low)</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#666",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                Price Range
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type='number'
                  placeholder='Min'
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  style={{
                    width: "50%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                  }}
                />
                <input
                  type='number'
                  placeholder='Max'
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{
                    width: "50%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Amenities Filter */}
          <div style={{ marginTop: "15px" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              Amenities
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {allAmenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityFilter(amenity)}
                  style={{
                    padding: "5px 12px",
                    background: selectedAmenities.includes(amenity)
                      ? "#4facfe"
                      : "#f0f0f0",
                    color: selectedAmenities.includes(amenity)
                      ? "white"
                      : "#666",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
          🛏️ Found {sortedRooms.length} rooms
        </p>

        {/* Rooms Grid */}
        {sortedRooms.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛏️</div>
            <h2 style={{ color: "#2c3e50", marginBottom: "10px" }}>
              No rooms found
            </h2>
            <p style={{ color: "#666" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "25px",
            }}
          >
            {sortedRooms.map((room) => {
              const typeStyle = getTypeColor(room.type);
              return (
                <div
                  key={room.id}
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
                  onClick={() => handleViewDetails(room)}
                >
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={room.image || GrandHotelNYCRoom}
                      alt={room.type}
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
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {!room.isAvailable ? "🔴 Booked" : "🟢 Available"}
                    </div>
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
                          fontSize: "20px",
                          color: "#2c3e50",
                        }}
                      >
                        {getTypeIcon(room.type)}{" "}
                        {room.type.charAt(0).toUpperCase() + room.type.slice(1)}{" "}
                        Room
                      </h3>
                      <span
                        style={{
                          background: typeStyle.bg,
                          color: typeStyle.color,
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                        }}
                      >
                        {typeStyle.text}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0 0 5px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      🏨 {room.hotelName}, {room.hotelCity}
                    </p>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      📍 Room #{room.roomNumber} • Floor {room.floor} •{" "}
                      {room.size}m²
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ color: "#f39c12" }}>★ {room.rating}</span>
                      <span style={{ color: "#999", fontSize: "12px" }}>
                        ({room.reviews} reviews)
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "15px",
                      }}
                    >
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            background: "#f0f0f0",
                            borderRadius: "12px",
                            color: "#666",
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span style={{ fontSize: "10px", color: "#999" }}>
                          +{room.amenities.length - 4}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: "#4facfe",
                          margin: 0,
                        }}
                      >
                        ${room.pricePerNight}
                        <span
                          style={{ fontSize: "12px", fontWeight: "normal" }}
                        >
                          /night
                        </span>
                      </p>
                      <button
                        style={{
                          padding: "8px 20px",
                          background: room.isAvailable ? "#4facfe" : "#ccc",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: room.isAvailable ? "pointer" : "not-allowed",
                          fontWeight: 600,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (room.isAvailable) handleBookClick(room);
                        }}
                      >
                        {room.isAvailable ? "Book Now →" : "Not Available"}
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

      {/* Modal for Room Details */}
      {showModal && selectedRoom && (
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
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                {getTypeIcon(selectedRoom.type)}
              </div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px" }}>
                {selectedRoom.type.charAt(0).toUpperCase() +
                  selectedRoom.type.slice(1)}{" "}
                Room
              </h2>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Room #{selectedRoom.roomNumber} • {selectedRoom.hotelName}
              </p>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
                Room Details
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <span style={{ color: "#999" }}>Size:</span>{" "}
                  <strong>{selectedRoom.size} m²</strong>
                </div>
                <div>
                  <span style={{ color: "#999" }}>Capacity:</span>{" "}
                  <strong>{selectedRoom.capacity} guests</strong>
                </div>
                <div>
                  <span style={{ color: "#999" }}>Bed Type:</span>{" "}
                  <strong>{selectedRoom.bedType}</strong>
                </div>
                <div>
                  <span style={{ color: "#999" }}>View:</span>{" "}
                  <strong>
                    {getViewIcon(selectedRoom.view)} {selectedRoom.view}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#999" }}>Floor:</span>{" "}
                  <strong>{selectedRoom.floor}</strong>
                </div>
                <div>
                  <span style={{ color: "#999" }}>Status:</span>{" "}
                  <strong>
                    {selectedRoom.isAvailable ? "🟢 Available" : "🔴 Booked"}
                  </strong>
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
              <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
                Description
              </h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                {selectedRoom.description}
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "20px",
                marginTop: "10px",
              }}
            >
              <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
                Amenities
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {selectedRoom.amenities.map((amenity) => (
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
                    {amenity}
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
                }}
              >
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#4facfe",
                    margin: 0,
                  }}
                >
                  ${selectedRoom.pricePerNight}
                  <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                    /night
                  </span>
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (selectedRoom.isAvailable) handleBookClick(selectedRoom);
                  }}
                  style={{
                    padding: "12px 30px",
                    background: selectedRoom.isAvailable ? "#4facfe" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: selectedRoom.isAvailable
                      ? "pointer"
                      : "not-allowed",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  disabled={!selectedRoom.isAvailable}
                >
                  {selectedRoom.isAvailable ? "Book Now" : "Not Available"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Booking */}
      {showConfirmModal && roomToBook && (
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
            setRoomToBook(null);
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "25px",
              padding: "30px",
              maxWidth: "450px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛏️</div>
            <h2 style={{ color: "#2c3e50", marginBottom: "12px" }}>
              Confirm Booking
            </h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Please confirm your booking details
            </p>

            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "15px",
                padding: "15px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666" }}>Room:</span>
                <span style={{ fontWeight: 500 }}>
                  {roomToBook.type.charAt(0).toUpperCase() +
                    roomToBook.type.slice(1)}{" "}
                  Room #{roomToBook.roomNumber}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666" }}>Hotel:</span>
                <span style={{ fontWeight: 500 }}>{roomToBook.hotelName}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666" }}>Location:</span>
                <span style={{ fontWeight: 500 }}>{roomToBook.hotelCity}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666" }}>Nights:</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <button
                    onClick={() => setNights(Math.max(1, nights - 1))}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {nights}
                  </span>
                  <button
                    onClick={() => setNights(nights + 1)}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid #eee",
                }}
              >
                <span style={{ color: "#666", fontWeight: "bold" }}>
                  Total Price:
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#4facfe",
                    fontSize: "20px",
                  }}
                >
                  ${(roomToBook.pricePerNight * nights).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#666" }}>Capacity:</span>
                <span style={{ fontWeight: 500 }}>
                  {roomToBook.capacity} guests
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={confirmBooking}
                style={{
                  padding: "10px 24px",
                  background: "#4facfe",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Yes, Book Now
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setRoomToBook(null);
                }}
                style={{
                  padding: "10px 24px",
                  background: "#f0f0f0",
                  color: "#666",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 500,
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

export default Rooms;
