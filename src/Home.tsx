// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Link,
//   useNavigate,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "../src/services/api";
// import { useAuth } from "../src/context/AuthContext";
// import { useTenant } from "./hooks/useTenant";

// // Pages

// // Importo të gjitha fotot (për fallback)
// import NewYorkImg from "./assets/NewYork.jpg";
// import BrazilImg from "./assets/Brazil.jpg";
// import CancunImg from "./assets/CANCUN.jpg";
// import ParisImg from "./assets/paris (2).jpg";
// import RomeImg from "./assets/rome.jpg";
// import LondonImg from "./assets/london.jpg";
// import TokyoImg from "./assets/Tokyo.jpg";
// import BaliImg from "./assets/Bali.jpg";
// import DubaiImg from "./assets/dubai.jpg";
// import HeroImage from "./assets/city.jpg";
// import MallorcaImg from "./assets/mallorca.jpg";

// interface Destination {
//   id: string;
//   name: string;
//   price: string;
//   image: string;
//   desc: string;
//   rating: number;
//   category: string;
// }

// // Demo data për fallback
// const getDemoDestinations = (): Destination[] => [
//   {
//     id: "1",
//     name: "New York, USA",
//     price: "$899",
//     image: NewYorkImg,
//     desc: "The city that never sleeps",
//     rating: 4.8,
//     category: "america",
//   },
//   {
//     id: "2",
//     name: "Rio de Janeiro, Brazil",
//     price: "$699",
//     image: BrazilImg,
//     desc: "Christ the Redeemer",
//     rating: 4.7,
//     category: "america",
//   },
//   {
//     id: "3",
//     name: "Cancun, Mexico",
//     price: "$599",
//     image: CancunImg,
//     desc: "Beautiful beaches",
//     rating: 4.6,
//     category: "america",
//   },
//   {
//     id: "4",
//     name: "Paris, France",
//     price: "$799",
//     image: ParisImg,
//     desc: "City of Love",
//     rating: 4.9,
//     category: "europe",
//   },
//   {
//     id: "5",
//     name: "Rome, Italy",
//     price: "$699",
//     image: RomeImg,
//     desc: "Eternal City",
//     rating: 4.8,
//     category: "europe",
//   },
//   {
//     id: "6",
//     name: "London, UK",
//     price: "$849",
//     image: LondonImg,
//     desc: "Big Ben & Royalty",
//     rating: 4.7,
//     category: "europe",
//   },
//   {
//     id: "7",
//     name: "Mallorca, Spain",
//     price: "$649",
//     image: MallorcaImg,
//     desc: "Beautiful Mediterranean island",
//     rating: 4.8,
//     category: "europe",
//   },
//   {
//     id: "8",
//     name: "Tokyo, Japan",
//     price: "$999",
//     image: TokyoImg,
//     desc: "Fuji & Sushi",
//     rating: 4.9,
//     category: "asia",
//   },
//   {
//     id: "9",
//     name: "Bali, Indonesia",
//     price: "$599",
//     image: BaliImg,
//     desc: "Paradise Island",
//     rating: 4.8,
//     category: "asia",
//   },
//   {
//     id: "10",
//     name: "Dubai, UAE",
//     price: "$1099",
//     image: DubaiImg,
//     desc: "Luxury & Shopping",
//     rating: 4.7,
//     category: "asia",
//   },
// ];

// // Komponenti Home
// export default function Home() {
//   const { user, logout, loading: authLoading } = useAuth();
//   const { tenant } = useTenant();

//   // Asnjë efekt për të lexuar token – vjen nga context
//   const isLoggedIn = !!user;

//   const navigate = useNavigate();
//   const [userName, setUserName] = useState("");
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const [loadingDestinations, setLoadingDestinations] = useState(true);
//   const [error, setError] = useState("");
//   const [token, setToken] = useState<string | null>(null);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   // Merr token-in nga localStorage
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const name = localStorage.getItem("userName") || "User";
//     setToken(storedToken);
//     setUserName(name);
//   }, []);

//   // Fetch destinations nga backend
//   const handleLogout = () => {
//     logout(); // pastron të gjitha të dhënat e autentikimit
//     navigate("/");
//   };

//   const fetchDestinations = async () => {
//     setLoadingDestinations(true);
//     setError("");
//     try {
//       const response = await api.get<Destination[]>("/destinations", {
//         headers: {
//           Authorization: user ? `Bearer ${user.token}` : "",
//           "tenant-id": tenant?.slug || "",
//         },
//       });
//       if (response.data?.length) {
//         setDestinations(response.data);
//       } else {
//         setDestinations(getDemoDestinations());
//       }
//     } catch (err) {
//       console.error(err);
//       setDestinations(getDemoDestinations());
//     } finally {
//       setLoadingDestinations(false);
//     }
//   };

//   useEffect(() => {
//     fetchDestinations();
//   }, [user, tenant?.slug]);

//   // Grupimi i destinacioneve sipas kategorive
//   const destinationsByCategory = {
//     america: destinations.filter((d) => d.category === "america"),
//     europe: destinations.filter((d) => d.category === "europe"),
//     asia: destinations.filter((d) => d.category === "asia"),
//   };

//   const categories = [
//     { id: "all", name: "All", icon: "🌍" },
//     { id: "america", name: "America", icon: "🗽" },
//     { id: "europe", name: "Europe", icon: "🏰" },
//     { id: "asia", name: "Asia", icon: "🗻" },
//   ];

//   // Navbar links - VETËM FAQET KRYESORE
//   const navLinks = [
//     { name: "Home", path: "/", icon: "🏠" },
//     { name: "Trips", path: "/travel-packages", icon: "✈️" },
//     { name: "Hotels", path: "/hotels", icon: "🏨" },
//     { name: "Flights", path: "/flights", icon: "✈️" },
//     { name: "Bookings", path: "/bookings", icon: "📅" },
//     { name: "AI Guide", path: "/ai", icon: "🤖" },
//   ];

//   // Quick access cards - TË GJITHA FAQET
//   const serviceCards = [
//     {
//       id: 1,
//       name: "Trips",
//       icon: "✈️",
//       color: "#4facfe",
//       path: "/travel-packages",
//       desc: "Book complete packages",
//     },
//     {
//       id: 2,
//       name: "Hotels",
//       icon: "🏨",
//       color: "#f093fb",
//       path: "/hotels",
//       desc: "Find best stays",
//     },
//     {
//       id: 3,
//       name: "Rooms",
//       icon: "🛏️",
//       color: "#fa709a",
//       path: "/rooms",
//       desc: "Hotel rooms",
//     },
//     {
//       id: 4,
//       name: "Flights",
//       icon: "✈️",
//       color: "#43e97b",
//       path: "/flights",
//       desc: "Book flights",
//     },
//     {
//       id: 5,
//       name: "Bookings",
//       icon: "📅",
//       color: "#f39c12",
//       path: "/bookings",
//       desc: "My bookings",
//     },
//     {
//       id: 6,
//       name: "Booking Items",
//       icon: "📋",
//       color: "#1abc9c",
//       path: "/booking-items",
//       desc: "Booking details",
//     },
//     {
//       id: 7,
//       name: "Payments",
//       icon: "💳",
//       color: "#27ae60",
//       path: "/payments",
//       desc: "Payment history",
//     },
//     {
//       id: 8,
//       name: "Reviews",
//       icon: "⭐",
//       color: "#e67e22",
//       path: "/reviews",
//       desc: "Traveler reviews",
//     },
//     {
//       id: 9,
//       name: "Notifications",
//       icon: "🔔",
//       color: "#3498db",
//       path: "/notifications",
//       desc: "Your alerts",
//     },
//     {
//       id: 10,
//       name: "AI Guide",
//       icon: "🤖",
//       color: "#9b59b6",
//       path: "/ai",
//       desc: "Travel assistant",
//     },
//   ];

//   const getDestinations = () => {
//     if (activeCategory === "all") {
//       return [
//         ...destinationsByCategory.america,
//         ...destinationsByCategory.europe,
//         ...destinationsByCategory.asia,
//       ];
//     }
//     return (
//       destinationsByCategory[
//         activeCategory as keyof typeof destinationsByCategory
//       ] || []
//     );
//   };

//   const filteredDestinations = getDestinations().filter((dest) =>
//     dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   if (loadingDestinations) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#f8f9fa",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
//           <h2 style={{ color: "#666" }}>Loading destinations...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8f9fa",
//         fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
//       }}
//     >
//       {/* Navbar */}
//       <nav
//         style={{
//           background: "white",
//           boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
//           padding: "15px 30px",
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: "15px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               cursor: "pointer",
//             }}
//             onClick={() => navigate("/")}
//           >
//             <span style={{ fontSize: "28px" }}>✈️</span>
//             <h1 style={{ fontSize: "22px", color: "#2c3e50", margin: 0 }}>
//               Travel <span style={{ color: "#4facfe" }}>Planner</span>
//             </h1>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: "20px",
//               alignItems: "center",
//               flexWrap: "wrap",
//             }}
//           >
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 style={{
//                   textDecoration: "none",
//                   color: "#666",
//                   fontSize: "14px",
//                   transition: "color 0.3s",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = "#4facfe")}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
//               >
//                 <span>{link.icon}</span> {link.name}
//               </Link>
//             ))}

//             {!isLoggedIn ? (
//               <button
//                 onClick={() => navigate("/login")}
//                 style={{
//                   padding: "8px 24px",
//                   background:
//                     "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "25px",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Login
//               </button>
//             ) : (
//               <>
//                 <span style={{ color: "#555" }}>👋 Welcome, {userName}</span>
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     padding: "8px 20px",
//                     background: "#e74c3c",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "20px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Logout
//                 </button>
//               </>
//             )}

//             <button
//               onClick={() => setShowMobileMenu(!showMobileMenu)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: "24px",
//                 cursor: "pointer",
//               }}
//             >
//               ☰
//             </button>
//           </div>
//         </div>

//         {showMobileMenu && (
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "10px",
//               marginTop: "15px",
//               paddingTop: "15px",
//               borderTop: "1px solid #eee",
//             }}
//           >
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 onClick={() => setShowMobileMenu(false)}
//                 style={{
//                   textDecoration: "none",
//                   color: "#666",
//                   padding: "8px 0",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 <span>{link.icon}</span> {link.name}
//               </Link>
//             ))}
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <div
//         style={{
//           position: "relative",
//           backgroundImage: `url(${HeroImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           minHeight: "550px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0, 0, 0, 0.5)",
//             zIndex: 1,
//           }}
//         />

//         <div
//           style={{
//             position: "relative",
//             zIndex: 2,
//             textAlign: "center",
//             color: "white",
//             padding: "80px 20px",
//             maxWidth: "800px",
//             margin: "0 auto",
//           }}
//         >
//           <h1
//             style={{
//               fontSize: "52px",
//               marginBottom: "16px",
//               fontWeight: "bold",
//               letterSpacing: "-1px",
//               textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
//               color: "white",
//             }}
//           >
//             ✈️ Travel Planner
//           </h1>
//           <p
//             style={{
//               fontSize: "20px",
//               opacity: 0.95,
//               marginBottom: "12px",
//               textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
//             }}
//           >
//             Your journey starts here
//           </p>
//           <p
//             style={{
//               fontSize: "15px",
//               opacity: 0.8,
//               marginBottom: "40px",
//               letterSpacing: "0.5px",
//             }}
//           >
//             Explore thousands of destinations worldwide
//           </p>

//           <div style={{ maxWidth: "580px", margin: "0 auto" }}>
//             <input
//               type='text'
//               placeholder='🔍 Search for destinations, hotels or flights...'
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "16px 28px",
//                 border: "none",
//                 borderRadius: "50px",
//                 fontSize: "16px",
//                 outline: "none",
//                 boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
//                 color: "#333",
//                 transition: "all 0.3s",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Category Tabs */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "15px",
//           padding: "30px 20px",
//           flexWrap: "wrap",
//           background: "white",
//           borderBottom: "1px solid #eee",
//         }}
//       >
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => setActiveCategory(cat.id)}
//             style={{
//               padding: "10px 25px",
//               background:
//                 activeCategory === cat.id
//                   ? "linear-gradient(135deg, #4facfe, #00f2fe)"
//                   : "transparent",
//               color: activeCategory === cat.id ? "white" : "#666",
//               border: activeCategory === cat.id ? "none" : "1px solid #ddd",
//               borderRadius: "30px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: 500,
//               transition: "all 0.3s",
//             }}
//           >
//             {cat.icon} {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* Destinations Grid */}
//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           padding: "50px 20px",
//         }}
//       >
//         {!token && (
//           <div
//             style={{
//               background: "#fff3cd",
//               color: "#856404",
//               padding: "10px",
//               borderRadius: "10px",
//               marginBottom: "20px",
//               textAlign: "center",
//               fontSize: "14px",
//             }}
//           >
//             ⚠️ You are viewing demo destinations. Please login to see
//             personalized recommendations.
//           </div>
//         )}
//         {error && (
//           <div
//             style={{
//               background: "#f8d7da",
//               color: "#721c24",
//               padding: "10px",
//               borderRadius: "10px",
//               marginBottom: "20px",
//               textAlign: "center",
//               fontSize: "14px",
//             }}
//           >
//             ⚠️ {error}
//           </div>
//         )}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//             gap: "30px",
//           }}
//         >
//           {filteredDestinations.map((dest, idx) => (
//             <div
//               key={idx}
//               style={{
//                 background: "white",
//                 borderRadius: "20px",
//                 overflow: "hidden",
//                 boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
//                 transition: "transform 0.3s, box-shadow 0.3s",
//                 cursor: "pointer",
//               }}
//               onClick={() => navigate("/travel-packages")}
//             >
//               <div
//                 style={{
//                   height: "240px",
//                   overflow: "hidden",
//                   backgroundColor: "#f0f0f0",
//                   position: "relative",
//                 }}
//               >
//                 <img
//                   src={dest.image}
//                   alt={dest.name}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     transition: "transform 0.5s",
//                   }}
//                 />
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: "12px",
//                     right: "12px",
//                     background: "rgba(0,0,0,0.75)",
//                     color: "#ffd700",
//                     padding: "6px 12px",
//                     borderRadius: "20px",
//                     fontSize: "13px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   ★ {dest.rating}
//                 </div>
//               </div>

//               <div style={{ padding: "20px" }}>
//                 <h3
//                   style={{
//                     margin: "0 0 8px 0",
//                     color: "#2c3e50",
//                     fontSize: "20px",
//                   }}
//                 >
//                   {dest.name}
//                 </h3>
//                 <p
//                   style={{
//                     color: "#666",
//                     fontSize: "14px",
//                     margin: "0 0 15px 0",
//                     lineHeight: "1.5",
//                   }}
//                 >
//                   {dest.desc}
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "#4facfe",
//                       fontWeight: "bold",
//                       fontSize: "22px",
//                       margin: 0,
//                     }}
//                   >
//                     {dest.price}
//                   </p>
//                   <button
//                     style={{
//                       padding: "10px 24px",
//                       background: "#4facfe",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "12px",
//                       cursor: "pointer",
//                       fontWeight: 600,
//                       transition: "all 0.3s",
//                     }}
//                   >
//                     Book Now →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Quick Access Section */}
//       <div
//         style={{
//           background: "white",
//           padding: "60px 20px",
//           marginTop: "20px",
//         }}
//       >
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <h2
//             style={{
//               textAlign: "center",
//               fontSize: "36px",
//               color: "#2c3e50",
//               marginBottom: "15px",
//             }}
//           >
//             Quick Access
//           </h2>
//           <p
//             style={{
//               textAlign: "center",
//               color: "#666",
//               marginBottom: "50px",
//               fontSize: "16px",
//             }}
//           >
//             Navigate to any section of your travel planner
//           </p>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//               gap: "20px",
//             }}
//           >
//             {serviceCards.map((service) => (
//               <div
//                 key={service.id}
//                 onClick={() => navigate(service.path)}
//                 style={{
//                   background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
//                   padding: "25px 20px",
//                   borderRadius: "20px",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   transition: "all 0.3s",
//                   border: `1px solid ${service.color}30`,
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "40px",
//                     marginBottom: "12px",
//                   }}
//                 >
//                   {service.icon}
//                 </div>
//                 <h3
//                   style={{
//                     color: "#2c3e50",
//                     marginBottom: "5px",
//                     fontSize: "16px",
//                   }}
//                 >
//                   {service.name}
//                 </h3>
//                 <p
//                   style={{
//                     color: "#666",
//                     fontSize: "11px",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   {service.desc}
//                 </p>
//                 <button
//                   style={{
//                     padding: "6px 16px",
//                     background: service.color,
//                     color: "white",
//                     border: "none",
//                     borderRadius: "20px",
//                     cursor: "pointer",
//                     fontSize: "11px",
//                     fontWeight: 500,
//                   }}
//                 >
//                   Explore →
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #4facfe, #4facfe)",
//           padding: "70px 20px",
//           textAlign: "center",
//           color: "white",
//         }}
//       >
//         <h2 style={{ fontSize: "36px", marginBottom: "16px" }}>
//           Ready for your next adventure? 🌍
//         </h2>
//         <p style={{ fontSize: "18px", marginBottom: "35px", opacity: 0.95 }}>
//           Join thousands of happy travelers who trust Travel Planner
//         </p>
//         {!isLoggedIn ? (
//           <button
//             onClick={() => navigate("/login")}
//             style={{
//               padding: "15px 45px",
//               background: "white",
//               color: "#4facfe",
//               border: "none",
//               borderRadius: "50px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "all 0.3s",
//               boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
//             }}
//           >
//             Get Started Now →
//           </button>
//         ) : (
//           <button
//             onClick={() => navigate("/travel-packages")}
//             style={{
//               padding: "15px 45px",
//               background: "white",
//               color: "#4facfe",
//               border: "none",
//               borderRadius: "50px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "all 0.3s",
//               boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
//             }}
//           >
//             Explore Packages →
//           </button>
//         )}
//       </div>

//       {/* Footer */}
//       <footer
//         style={{
//           background: "#1a252f",
//           padding: "50px 20px 30px",
//           textAlign: "center",
//           color: "white",
//         }}
//       >
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "20px",
//               flexWrap: "wrap",
//               marginBottom: "30px",
//             }}
//           >
//             {serviceCards.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 style={{
//                   color: "#ccc",
//                   textDecoration: "none",
//                   fontSize: "12px",
//                 }}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>
//           <p>© 2026 Travel Planner. All rights reserved.</p>
//           <p style={{ fontSize: "13px", opacity: 0.6, marginTop: "15px" }}>
//             Your trusted partner for unforgettable journeys
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// pages/Home.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { useTenant } from "../src/hooks/useTenant";

// Importet e imazheve (për fallback)
import NewYorkImg from "./assets/NewYork.jpg";
import BrazilImg from "./assets/Brazil.jpg";
import CancunImg from "./assets/CANCUN.jpg";
import ParisImg from "./assets/paris (2).jpg";
import RomeImg from "./assets/rome.jpg";
import LondonImg from "./assets/london.jpg";
import TokyoImg from "./assets/Tokyo.jpg";
import BaliImg from "./assets/Bali.jpg";
import DubaiImg from "./assets/dubai.jpg";
import HeroImage from "./assets/city.jpg";
import MallorcaImg from "./assets/mallorca.jpg";
import LandingDrawer from "./components/LandingDrawer";

interface Destination {
  id: string;
  name: string;
  price: string;
  image: string;
  desc: string;
  rating: number;
  category: string;
}

// Demo data (fallback)
const getDemoDestinations = (): Destination[] => [
  {
    id: "1",
    name: "New York, USA",
    price: "$899",
    image: NewYorkImg,
    desc: "The city that never sleeps",
    rating: 4.8,
    category: "america",
  },
  {
    id: "2",
    name: "Rio de Janeiro, Brazil",
    price: "$699",
    image: BrazilImg,
    desc: "Christ the Redeemer",
    rating: 4.7,
    category: "america",
  },
  {
    id: "3",
    name: "Cancun, Mexico",
    price: "$599",
    image: CancunImg,
    desc: "Beautiful beaches",
    rating: 4.6,
    category: "america",
  },
  {
    id: "4",
    name: "Paris, France",
    price: "$799",
    image: ParisImg,
    desc: "City of Love",
    rating: 4.9,
    category: "europe",
  },
  {
    id: "5",
    name: "Rome, Italy",
    price: "$699",
    image: RomeImg,
    desc: "Eternal City",
    rating: 4.8,
    category: "europe",
  },
  {
    id: "6",
    name: "London, UK",
    price: "$849",
    image: LondonImg,
    desc: "Big Ben & Royalty",
    rating: 4.7,
    category: "europe",
  },
  {
    id: "7",
    name: "Mallorca, Spain",
    price: "$649",
    image: MallorcaImg,
    desc: "Beautiful Mediterranean island",
    rating: 4.8,
    category: "europe",
  },
  {
    id: "8",
    name: "Tokyo, Japan",
    price: "$999",
    image: TokyoImg,
    desc: "Fuji & Sushi",
    rating: 4.9,
    category: "asia",
  },
  {
    id: "9",
    name: "Bali, Indonesia",
    price: "$599",
    image: BaliImg,
    desc: "Paradise Island",
    rating: 4.8,
    category: "asia",
  },
  {
    id: "10",
    name: "Dubai, UAE",
    price: "$1099",
    image: DubaiImg,
    desc: "Luxury & Shopping",
    rating: 4.7,
    category: "asia",
  },
];

// Përcakto kategorinë në mungesë të fushës nga backend
const getCategory = (name: string, country?: string): string => {
  const text = `${name} ${country || ""}`.toLowerCase();
  if (
    text.includes("new york") ||
    text.includes("brazil") ||
    text.includes("cancun")
  )
    return "america";
  if (
    text.includes("paris") ||
    text.includes("rome") ||
    text.includes("london") ||
    text.includes("mallorca")
  )
    return "europe";
  if (text.includes("tokyo") || text.includes("bali") || text.includes("dubai"))
    return "asia";
  return "europe";
};

export default function Home() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { tenant } = useTenant();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [error, setError] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isLoggedIn = !!user;
  const userName = user?.name || user?.email || "User";

  // Fetch destinations nga backend
  const fetchDestinations = async () => {
    setLoadingDestinations(true);
    setError("");
    try {
      const response = await api.get("/destinations");
      if (response.data && response.data.length > 0) {
        const formatted = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price ? `$${item.price}` : "$0",
          image:
            item.imageUrl ||
            (item.name.includes("New York") ? NewYorkImg : HeroImage),
          desc: item.description || item.name,
          rating: item.rating || 4.5,
          category: getCategory(item.name, item.country),
        }));
        setDestinations(formatted);
      } else {
        setDestinations(getDemoDestinations());
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setDestinations(getDemoDestinations());
      setError("Could not load destinations from server. Showing demo data.");
    } finally {
      setLoadingDestinations(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate(`/${tenant?.slug || "tenant1"}/login`);
  };

  // Grupimi sipas kategorive
  const destinationsByCategory = {
    america: destinations.filter((d) => d.category === "america"),
    europe: destinations.filter((d) => d.category === "europe"),
    asia: destinations.filter((d) => d.category === "asia"),
  };

  const categories = [
    { id: "all", name: "All", icon: "🌍" },
    { id: "america", name: "America", icon: "🗽" },
    { id: "europe", name: "Europe", icon: "🏰" },
    { id: "asia", name: "Asia", icon: "🗻" },
  ];

  // Linkat e navbar – të gjitha me slug
  const navLinks = [
    { name: "Home", path: `/${tenant?.slug || "tenant1"}`, icon: "🏠" },
    {
      name: "Trips",
      path: `/${tenant?.slug || "tenant1"}/travel-packages`,
      icon: "✈️",
    },
    {
      name: "Hotels",
      path: `/${tenant?.slug || "tenant1"}/hotels`,
      icon: "🏨",
    },
    {
      name: "Flights",
      path: `/${tenant?.slug || "tenant1"}/flights`,
      icon: "✈️",
    },
    {
      name: "Bookings",
      path: `/${tenant?.slug || "tenant1"}/bookings`,
      icon: "📅",
    },
    { name: "AI Guide", path: `/${tenant?.slug || "tenant1"}/ai`, icon: "🤖" },
  ];

  // Quick access cards – të gjitha me slug
  const serviceCards = [
    {
      id: 1,
      name: "Trips",
      icon: "✈️",
      color: "#4facfe",
      path: `/${tenant?.slug || "tenant1"}/travel-packages`,
      desc: "Book complete packages",
    },
    {
      id: 2,
      name: "Hotels",
      icon: "🏨",
      color: "#f093fb",
      path: `/${tenant?.slug || "tenant1"}/hotels`,
      desc: "Find best stays",
    },
    {
      id: 3,
      name: "Rooms",
      icon: "🛏️",
      color: "#fa709a",
      path: `/${tenant?.slug || "tenant1"}/rooms`,
      desc: "Hotel rooms",
    },
    {
      id: 4,
      name: "Flights",
      icon: "✈️",
      color: "#43e97b",
      path: `/${tenant?.slug || "tenant1"}/flights`,
      desc: "Book flights",
    },
    {
      id: 5,
      name: "Bookings",
      icon: "📅",
      color: "#f39c12",
      path: `/${tenant?.slug || "tenant1"}/bookings`,
      desc: "My bookings",
    },
    {
      id: 6,
      name: "Booking Items",
      icon: "📋",
      color: "#1abc9c",
      path: `/${tenant?.slug || "tenant1"}/booking-items`,
      desc: "Booking details",
    },
    {
      id: 7,
      name: "Payments",
      icon: "💳",
      color: "#27ae60",
      path: `/${tenant?.slug || "tenant1"}/payments`,
      desc: "Payment history",
    },
    {
      id: 8,
      name: "Reviews",
      icon: "⭐",
      color: "#e67e22",
      path: `/${tenant?.slug || "tenant1"}/reviews`,
      desc: "Traveler reviews",
    },
    {
      id: 9,
      name: "Notifications",
      icon: "🔔",
      color: "#3498db",
      path: `/${tenant?.slug || "tenant1"}/notifications`,
      desc: "Your alerts",
    },
    {
      id: 10,
      name: "AI Guide",
      icon: "🤖",
      color: "#9b59b6",
      path: `/${tenant?.slug || "tenant1"}/ai`,
      desc: "Travel assistant",
    },
  ];

  const getDestinations = () => {
    if (activeCategory === "all") {
      return [
        ...destinationsByCategory.america,
        ...destinationsByCategory.europe,
        ...destinationsByCategory.asia,
      ];
    }
    return (
      destinationsByCategory[
        activeCategory as keyof typeof destinationsByCategory
      ] || []
    );
  };

  const filteredDestinations = getDestinations().filter((dest) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  <LandingDrawer />;

  if (loadingDestinations || authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
          <h2 style={{ color: "#666" }}>Loading destinations...</h2>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "white",
          boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
          padding: "15px 30px",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/${tenant?.slug || "tenant1"}`)}
          >
            <span style={{ fontSize: "28px" }}>✈️</span>
            <h1 style={{ fontSize: "22px", color: "#2c3e50", margin: 0 }}>
              Travel <span style={{ color: "#4facfe" }}>Planner</span>
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: "none",
                  color: "#666",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span>{link.icon}</span> {link.name}
              </Link>
            ))}
            {!isLoggedIn ? (
              <button
                onClick={() => navigate(`/${tenant?.slug || "tenant1"}/login`)}
                style={{
                  padding: "8px 24px",
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Login
              </button>
            ) : (
              <>
                <span style={{ color: "#555" }}>👋 Welcome, {userName}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "8px 20px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          </div>
        </div>
        {showMobileMenu && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #eee",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setShowMobileMenu(false)}
                style={{
                  textDecoration: "none",
                  color: "#666",
                  padding: "8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{link.icon}</span> {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section – i njëjtë si origjinali */}
      <div
        style={{
          position: "relative",
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "white",
            padding: "80px 20px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              marginBottom: "16px",
              fontWeight: "bold",
              letterSpacing: "-1px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              color: "white",
            }}
          >
            ✈️ Travel Planner
          </h1>
          <p
            style={{
              fontSize: "20px",
              opacity: 0.95,
              marginBottom: "12px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Your journey starts here
          </p>
          <p
            style={{
              fontSize: "15px",
              opacity: 0.8,
              marginBottom: "40px",
              letterSpacing: "0.5px",
            }}
          >
            Explore thousands of destinations worldwide
          </p>
          <div style={{ maxWidth: "580px", margin: "0 auto" }}>
            <input
              type='text'
              placeholder='🔍 Search for destinations, hotels or flights...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 28px",
                border: "none",
                borderRadius: "50px",
                fontSize: "16px",
                outline: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                color: "#333",
                transition: "all 0.3s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          padding: "30px 20px",
          flexWrap: "wrap",
          background: "white",
          borderBottom: "1px solid #eee",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "10px 25px",
              background:
                activeCategory === cat.id
                  ? "linear-gradient(135deg, #4facfe, #00f2fe)"
                  : "transparent",
              color: activeCategory === cat.id ? "white" : "#666",
              border: activeCategory === cat.id ? "none" : "1px solid #ddd",
              borderRadius: "30px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.3s",
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "50px 20px" }}
      >
        {!isLoggedIn && (
          <div
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            ⚠️ You are viewing demo destinations. Please login to see
            personalized recommendations.
          </div>
        )}
        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/${tenant?.slug || "tenant1"}/travel-packages`)
              }
            >
              <div
                style={{
                  height: "240px",
                  overflow: "hidden",
                  backgroundColor: "#f0f0f0",
                  position: "relative",
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(0,0,0,0.75)",
                    color: "#ffd700",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  ★ {dest.rating}
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    color: "#2c3e50",
                    fontSize: "20px",
                  }}
                >
                  {dest.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    margin: "0 0 15px 0",
                    lineHeight: "1.5",
                  }}
                >
                  {dest.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      padding: "10px 24px",
                      background: "#4facfe",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.3s",
                    }}
                  >
                    View More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Section */}
      <div
        style={{ background: "white", padding: "60px 20px", marginTop: "20px" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "36px",
              color: "#2c3e50",
              marginBottom: "15px",
            }}
          >
            Quick Access
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "50px",
              fontSize: "16px",
            }}
          >
            Navigate to any section of your travel planner
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {serviceCards.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(service.path)}
                style={{
                  background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
                  padding: "25px 20px",
                  borderRadius: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  border: `1px solid ${service.color}30`,
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                  {service.icon}
                </div>
                <h3
                  style={{
                    color: "#2c3e50",
                    marginBottom: "5px",
                    fontSize: "16px",
                  }}
                >
                  {service.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "11px",
                    marginBottom: "10px",
                  }}
                >
                  {service.desc}
                </p>
                <button
                  style={{
                    padding: "6px 16px",
                    background: service.color,
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                >
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #4facfe, #4facfe)",
          padding: "70px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "36px", marginBottom: "16px" }}>
          Ready for your next adventure? 🌍
        </h2>
        <p style={{ fontSize: "18px", marginBottom: "35px", opacity: 0.95 }}>
          Join thousands of happy travelers who trust Travel Planner
        </p>
        {!isLoggedIn ? (
          <button
            onClick={() => navigate(`/${tenant?.slug || "tenant1"}/login`)}
            style={{
              padding: "15px 45px",
              background: "white",
              color: "#4facfe",
              border: "none",
              borderRadius: "50px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
            }}
          >
            Get Started Now →
          </button>
        ) : (
          <button
            onClick={() =>
              navigate(`/${tenant?.slug || "tenant1"}/travel-packages`)
            }
            style={{
              padding: "15px 45px",
              background: "white",
              color: "#4facfe",
              border: "none",
              borderRadius: "50px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
            }}
          >
            Explore Packages →
          </button>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#1a252f",
          padding: "50px 20px 30px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            {serviceCards.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  fontSize: "12px",
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p>© 2026 Travel Planner. All rights reserved.</p>
          <p style={{ fontSize: "13px", opacity: 0.6, marginTop: "15px" }}>
            Your trusted partner for unforgettable journeys
          </p>
        </div>
      </footer>
    </div>
  );
}
