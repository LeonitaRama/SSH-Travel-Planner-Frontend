// // pages/Airlines.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// interface Airline {
//   id: string;
//   name: string;
//   code: string;
//   country: string;
//   logoUrl?: string;
//   website?: string;
//   rating?: number;
//   description?: string;
//   createdAt: string;
// }

// function Airlines() {
//   const navigate = useNavigate();
//   const [airlines, setAirlines] = useState<Airline[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState<"name" | "rating">("name");
//   const [token, setToken] = useState<string | null>(null);
//   const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     setToken(localStorage.getItem("token"));
//   }, []);

//   const fetchAirlines = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/airlines", {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//           "tenant-id": localStorage.getItem("tenantId") || "",
//         },
//       });
//       if (response.data?.length) setAirlines(response.data);
//       else setAirlines(getDemoAirlines());
//     } catch (err) {
//       console.error(err);
//       setAirlines(getDemoAirlines());
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDemoAirlines = (): Airline[] => [
//     {
//       id: "1",
//       name: "Emirates",
//       code: "EK",
//       country: "UAE",
//       logoUrl: "",
//       rating: 4.9,
//       description: "Luxury airline from Dubai",
//       createdAt: "2024-01-01",
//     },
//     {
//       id: "2",
//       name: "Singapore Airlines",
//       code: "SQ",
//       country: "Singapore",
//       rating: 4.8,
//       description: "World-class service",
//       createdAt: "2024-01-02",
//     },
//     {
//       id: "3",
//       name: "Delta Air Lines",
//       code: "DL",
//       country: "USA",
//       rating: 4.5,
//       description: "Major US carrier",
//       createdAt: "2024-01-03",
//     },
//     {
//       id: "4",
//       name: "British Airways",
//       code: "BA",
//       country: "UK",
//       rating: 4.4,
//       description: "UK flag carrier",
//       createdAt: "2024-01-04",
//     },
//   ];

//   useEffect(() => {
//     fetchAirlines();
//   }, [token]);

//   const filtered = airlines.filter(
//     (a) =>
//       a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       a.country.toLowerCase().includes(searchTerm.toLowerCase()),
//   );
//   const sorted = [...filtered].sort((a, b) =>
//     sortBy === "name"
//       ? a.name.localeCompare(b.name)
//       : (b.rating || 0) - (a.rating || 0),
//   );

//   if (loading)
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         ✈️ Loading airlines...
//       </div>
//     );

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f0f2f5",
//         padding: "40px 20px",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         <h1 style={{ fontSize: 42, textAlign: "center" }}>✈️ Airlines</h1>
//         <p style={{ textAlign: "center" }}>
//           Discover airlines operating worldwide
//         </p>

//         {!token && (
//           <div
//             style={{
//               background: "#fff3cd",
//               padding: 12,
//               borderRadius: 12,
//               marginBottom: 20,
//               textAlign: "center",
//             }}
//           >
//             ⚠️ Login to see real airline data
//           </div>
//         )}
//         {error && (
//           <div style={{ color: "red", textAlign: "center" }}>{error}</div>
//         )}

//         <div style={{ marginBottom: 30 }}>
//           <input
//             type='text'
//             placeholder='Search by name or country...'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               width: "100%",
//               padding: 12,
//               borderRadius: 30,
//               border: "none",
//               boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//             }}
//           />
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
//             gap: 20,
//           }}
//         >
//           {sorted.map((airline) => (
//             <div
//               key={airline.id}
//               onClick={() => {
//                 setSelectedAirline(airline);
//                 setShowModal(true);
//               }}
//               style={{
//                 background: "white",
//                 borderRadius: 20,
//                 padding: 20,
//                 cursor: "pointer",
//                 transition: "0.2s",
//               }}
//             >
//               <h3>
//                 {airline.name} ({airline.code})
//               </h3>
//               <p>{airline.country}</p>
//               <div>⭐ {airline.rating || "N/A"}</div>
//               <p style={{ fontSize: 12, color: "#666" }}>
//                 {airline.description?.substring(0, 80)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {showModal && selectedAirline && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.7)",
//             backdropFilter: "blur(5px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               borderRadius: 25,
//               padding: 30,
//               maxWidth: 500,
//             }}
//           >
//             <h2>{selectedAirline.name}</h2>
//             <p>
//               <strong>Code:</strong> {selectedAirline.code}
//             </p>
//             <p>
//               <strong>Country:</strong> {selectedAirline.country}
//             </p>
//             <p>
//               <strong>Rating:</strong> ⭐ {selectedAirline.rating}
//             </p>
//             <p>{selectedAirline.description}</p>
//             {selectedAirline.website && (
//               <p>
//                 🌐{" "}
//                 <a href={selectedAirline.website} target='_blank'>
//                   {selectedAirline.website}
//                 </a>
//               </p>
//             )}
//             <button
//               onClick={() => setShowModal(false)}
//               style={{
//                 background: "#4facfe",
//                 color: "white",
//                 border: "none",
//                 padding: "10px 20px",
//                 borderRadius: 30,
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Airlines;
// pages/Airlines.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
// Import logo të disponueshme (përdor ato që ke në assets)
import EmiratesImg from "../assets/Emirates.jpg";
import BritishAirwaysImg from "../assets/BritishAirways.jpg";
import DeltaImg from "../assets/Delta.jpg";
import LufthansaImg from "../assets/Lufthansa.jpg";
import AirFranceImg from "../assets/AirFrance.jpg";
import QatarImg from "../assets/Qatar.jpg";
import TurkishImg from "../assets/Turkish.jpg";
import SingaporeImg from "../assets/Singapore.jpg";

interface Airline {
  id: string;
  name: string;
  code: string;
  country: string;
  logoUrl?: string;
  website?: string;
  rating: number;
  description?: string;
  foundedYear?: number;
  fleetSize?: number;
  destinations?: number;
  createdAt: string;
}

function Airlines() {
  const navigate = useNavigate();
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "founded">("name");
  const [filterCountry, setFilterCountry] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const response = await api.get("/airlines", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });
      if (response.data?.length) setAirlines(response.data);
      else setAirlines(getDemoAirlines());
    } catch (err) {
      console.error(err);
      setAirlines(getDemoAirlines());
    } finally {
      setLoading(false);
    }
  };

  const getDemoAirlines = (): Airline[] => [
    {
      id: "1",
      name: "Emirates",
      code: "EK",
      country: "UAE",
      logoUrl: EmiratesImg,
      rating: 4.9,
      description: "Luxury airline with world-class service",
      foundedYear: 1985,
      fleetSize: 260,
      destinations: 150,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Singapore Airlines",
      code: "SQ",
      country: "Singapore",
      logoUrl: SingaporeImg,
      rating: 4.8,
      description: "Award-winning service and comfort",
      foundedYear: 1972,
      fleetSize: 150,
      destinations: 130,
      createdAt: "2024-01-02",
    },
    {
      id: "3",
      name: "Delta Air Lines",
      code: "DL",
      country: "USA",
      logoUrl: DeltaImg,
      rating: 4.5,
      description: "Major US carrier with extensive network",
      foundedYear: 1924,
      fleetSize: 800,
      destinations: 275,
      createdAt: "2024-01-03",
    },
    {
      id: "4",
      name: "British Airways",
      code: "BA",
      country: "UK",
      logoUrl: BritishAirwaysImg,
      rating: 4.4,
      description: "Flag carrier of the United Kingdom",
      foundedYear: 1974,
      fleetSize: 280,
      destinations: 180,
      createdAt: "2024-01-04",
    },
    {
      id: "5",
      name: "Air France",
      code: "AF",
      country: "France",
      logoUrl: AirFranceImg,
      rating: 4.3,
      description: "French elegance in the skies",
      foundedYear: 1933,
      fleetSize: 210,
      destinations: 200,
      createdAt: "2024-01-05",
    },
    {
      id: "6",
      name: "Lufthansa",
      code: "LH",
      country: "Germany",
      logoUrl: LufthansaImg,
      rating: 4.4,
      description: "German precision and service",
      foundedYear: 1953,
      fleetSize: 280,
      destinations: 220,
      createdAt: "2024-01-06",
    },
    {
      id: "7",
      name: "Qatar Airways",
      code: "QR",
      country: "Qatar",
      logoUrl: QatarImg,
      rating: 4.8,
      description: "5-star rated airline",
      foundedYear: 1993,
      fleetSize: 200,
      destinations: 160,
      createdAt: "2024-01-07",
    },
    {
      id: "8",
      name: "Turkish Airlines",
      code: "TK",
      country: "Turkey",
      logoUrl: TurkishImg,
      rating: 4.5,
      description: "Fly to most countries worldwide",
      foundedYear: 1933,
      fleetSize: 350,
      destinations: 300,
      createdAt: "2024-01-08",
    },
  ];

  useEffect(() => {
    fetchAirlines();
  }, [token]);

  const uniqueCountries = [...new Set(airlines.map((a) => a.country))];

  const filtered = airlines
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((a) => (filterCountry ? a.country === filterCountry : true));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "founded")
      return (a.foundedYear || 0) - (b.foundedYear || 0);
    return 0;
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
        ✈️ Loading airlines...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "40px 20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 64 }}>✈️</div>
          <h1 style={{ fontSize: 42, color: "#2c3e50" }}>World Airlines</h1>
          <p>Discover top airlines and their services</p>
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
            ⚠️ Login to see real airline data
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
              placeholder='🔍 Search by name, code or country...'
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
              <option value='rating'>Sort by Rating</option>
              <option value='founded'>Sort by Founded Year</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
            gap: 25,
          }}
        >
          {sorted.map((airline) => (
            <div
              key={airline.id}
              onClick={() => {
                setSelectedAirline(airline);
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
              <div style={{ height: 160, overflow: "hidden" }}>
                <img
                  src={airline.logoUrl}
                  alt={airline.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 20 }}>
                <h3>
                  {airline.name}{" "}
                  <span style={{ fontSize: 14, color: "#999" }}>
                    ({airline.code})
                  </span>
                </h3>
                <p>{airline.country}</p>
                <div>⭐ {airline.rating} / 5</div>
                <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                  {airline.description?.substring(0, 80)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedAirline && (
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
              width: "90%",
            }}
          >
            <img
              src={selectedAirline.logoUrl}
              alt={selectedAirline.name}
              style={{ width: "100%", borderRadius: 15, marginBottom: 20 }}
            />
            <h2>
              {selectedAirline.name} ({selectedAirline.code})
            </h2>
            <p>
              <strong>Country:</strong> {selectedAirline.country}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {selectedAirline.rating}
            </p>
            {selectedAirline.foundedYear && (
              <p>
                <strong>Founded:</strong> {selectedAirline.foundedYear}
              </p>
            )}
            {selectedAirline.fleetSize && (
              <p>
                <strong>Fleet size:</strong> {selectedAirline.fleetSize}
              </p>
            )}
            {selectedAirline.destinations && (
              <p>
                <strong>Destinations:</strong> {selectedAirline.destinations}
              </p>
            )}
            <p>{selectedAirline.description}</p>
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

export default Airlines;
