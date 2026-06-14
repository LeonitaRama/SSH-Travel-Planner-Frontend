// pages/Airports.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
// Përdor imazhe ekzistuese ose placeholder
import JFKImg from "../assets/NewYork.jpg";
import LHRImg from "../assets/london.jpg";
import CDGImg from "../assets/paris (2).jpg";
import DXBImg from "../assets/dubai.jpg";
import HNDImg from "../assets/Tokyo.jpg";

interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  imageUrl?: string;
  website?: string;
  timezone?: string;
  terminals?: number;
  annualPassengers?: number;
  createdAt: string;
}

function Airports() {
  const navigate = useNavigate();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code" | "city">("name");
  const [filterCountry, setFilterCountry] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/airports", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });
      if (response.data?.length) setAirports(response.data);
      else setAirports(getDemoAirports());
    } catch (err) {
      console.error(err);
      setAirports(getDemoAirports());
    } finally {
      setLoading(false);
    }
  };

  const getDemoAirports = (): Airport[] => [
    {
      id: "1",
      name: "John F. Kennedy International Airport",
      code: "JFK",
      city: "New York",
      country: "USA",
      imageUrl: JFKImg,
      timezone: "America/New_York",
      terminals: 6,
      annualPassengers: 62000000,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "London Heathrow Airport",
      code: "LHR",
      city: "London",
      country: "UK",
      imageUrl: LHRImg,
      timezone: "Europe/London",
      terminals: 4,
      annualPassengers: 80000000,
      createdAt: "2024-01-02",
    },
    {
      id: "3",
      name: "Paris Charles de Gaulle",
      code: "CDG",
      city: "Paris",
      country: "France",
      imageUrl: CDGImg,
      timezone: "Europe/Paris",
      terminals: 3,
      annualPassengers: 72000000,
      createdAt: "2024-01-03",
    },
    {
      id: "4",
      name: "Dubai International Airport",
      code: "DXB",
      city: "Dubai",
      country: "UAE",
      imageUrl: DXBImg,
      timezone: "Asia/Dubai",
      terminals: 3,
      annualPassengers: 86000000,
      createdAt: "2024-01-04",
    },
    {
      id: "5",
      name: "Tokyo Haneda Airport",
      code: "HND",
      city: "Tokyo",
      country: "Japan",
      imageUrl: HNDImg,
      timezone: "Asia/Tokyo",
      terminals: 3,
      annualPassengers: 87000000,
      createdAt: "2024-01-05",
    },
  ];

  useEffect(() => {
    fetchAirports();
  }, [token]);

  const uniqueCountries = [...new Set(airports.map((a) => a.country))];
  const filtered = airports
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.city.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((a) => (filterCountry ? a.country === filterCountry : true));
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "code") return a.code.localeCompare(b.code);
    return a.city.localeCompare(b.city);
  });

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🛫 Loading airports...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 64 }}>🛫</div>
          <h1 style={{ fontSize: 42, color: "#2c3e50" }}>World Airports</h1>
          <p>Your gateway to the world</p>
        </div>
        {!token && (
          <div
            style={{
              background: "#fff3cd",
              padding: 12,
              borderRadius: 12,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            ⚠️ Login to see real airport data
          </div>
        )}
        {error && (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        )}

        <div
          style={{
            background: "white",
            borderRadius: 25,
            padding: 25,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
              gap: 15,
            }}
          >
            <input
              type='text'
              placeholder='🔍 Search by name, code or city...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 15,
                border: "1px solid #ddd",
              }}
            />
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 15,
                border: "1px solid #ddd",
              }}
            >
              <option value=''>All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: 12,
                borderRadius: 15,
                border: "1px solid #ddd",
              }}
            >
              <option value='name'>Sort by Name</option>
              <option value='code'>Sort by Code</option>
              <option value='city'>Sort by City</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
            gap: 25,
          }}
        >
          {sorted.map((airport) => (
            <div
              key={airport.id}
              onClick={() => {
                setSelectedAirport(airport);
                setShowModal(true);
              }}
              style={{
                background: "white",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ height: 180, overflow: "hidden" }}>
                <img
                  src={airport.imageUrl}
                  alt={airport.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 20 }}>
                <h3>{airport.name}</h3>
                <p>
                  <strong>{airport.code}</strong> – {airport.city},{" "}
                  {airport.country}
                </p>
                {airport.timezone && (
                  <p style={{ fontSize: 12, color: "#666" }}>
                    🕒 {airport.timezone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedAirport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 25,
              padding: 30,
              maxWidth: 500,
            }}
          >
            <img
              src={selectedAirport.imageUrl}
              alt={selectedAirport.name}
              style={{
                width: "100%",
                height: "300px",
                borderRadius: 15,
                marginBottom: 20,
              }}
            />
            <h2>
              {selectedAirport.name} ({selectedAirport.code})
            </h2>
            <p>
              <strong>City:</strong> {selectedAirport.city}
            </p>
            <p>
              <strong>Country:</strong> {selectedAirport.country}
            </p>
            {selectedAirport.timezone && (
              <p>
                <strong>Timezone:</strong> {selectedAirport.timezone}
              </p>
            )}
            {selectedAirport.terminals && (
              <p>
                <strong>Terminals:</strong> {selectedAirport.terminals}
              </p>
            )}
            {selectedAirport.annualPassengers && (
              <p>
                <strong>Annual Passengers:</strong>{" "}
                {selectedAirport.annualPassengers.toLocaleString()}
              </p>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "#4facfe",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: 30,
                marginTop: 20,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Airports;
