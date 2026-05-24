import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import Flights from "./pages/Flights";
import Bookings from "./pages/Bookings";
import BookingItems from "./pages/BookingItems";
import Payments from "./pages/Payments";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import TravelPackages from "./pages/TravelPackages";
import AiPage from "./pages/AiPage";
import Login from "./pages/Login";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>SSH Travel Planner</h1>
      <p>Welcome to the system 🚀</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Main Pages */}
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/booking-items" element={<BookingItems />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/travel-packages" element={<TravelPackages />} />
        <Route path="/ai" element={<AiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
