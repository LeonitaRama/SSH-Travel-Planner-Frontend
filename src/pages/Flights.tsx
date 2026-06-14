import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Importo të gjitha imazhet për linjat ajrore
import AirFranceImg from "../assets/AirFrance.jpg";
import BritishAirwaysImg from "../assets/BritishAirways.jpg";
import DeltaImg from "../assets/Delta.jpg";
import UnitedImg from "../assets/United.jpg";
import EmiratesImg from "../assets/Emirates.jpg";
import LufthansaImg from "../assets/Lufthansa.jpg";
import TurkishImg from "../assets/Turkish.jpg";
import QatarImg from "../assets/Qatar.jpg";
import AirCanadaImg from "../assets/AirCanada.jpg";
import VirginImg from "../assets/Virgin.jpg";
import KLMImg from "../assets/KLM.jpg";
import AirNewZealandImg from "../assets/AirNewZealand.jpg";
import CathayImg from "../assets/Cathay.jpg";
import SingaporeImg from "../assets/Singapore.jpg";
import SwissImg from "../assets/Swiss.jpg";
import IberiaImg from "../assets/Iberia.jpg";
import AlitaliaImg from "../assets/Alitalia.jpg";
import ANAImg from "../assets/ANA.jpg";
import KoreanImg from "../assets/Korean.jpg";
import EtihadImg from "../assets/Etihad.jpg";

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  availableSeats: number;
  class: "economy" | "business" | "first";
  stops: number;
  stopoverCities?: string[];
  baggage: string;
  cancellationPolicy: string;
  rating: number;
  image?: string;
}

// Demo data për fallback - fluturime të ndryshme me imazhe
const getDemoFlights = (): Flight[] => [
  {
    id: "1",
    flightNumber: "AF123",
    airline: "Air France",
    from: "New York",
    fromCode: "JFK",
    to: "Paris",
    toCode: "CDG",
    departureDate: "2024-06-15",
    departureTime: "18:30",
    arrivalDate: "2024-06-16",
    arrivalTime: "08:00",
    duration: "7h 30m",
    price: 599,
    currency: "USD",
    availableSeats: 42,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.5,
    image: AirFranceImg,
  },
  {
    id: "2",
    flightNumber: "BA456",
    airline: "British Airways",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departureDate: "2024-06-15",
    departureTime: "20:00",
    arrivalDate: "2024-06-16",
    arrivalTime: "08:30",
    duration: "7h 30m",
    price: 649,
    currency: "USD",
    availableSeats: 28,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.6,
    image: BritishAirwaysImg,
  },
  {
    id: "3",
    flightNumber: "DL789",
    airline: "Delta Airlines",
    from: "New York",
    fromCode: "JFK",
    to: "Tokyo",
    toCode: "HND",
    departureDate: "2024-06-20",
    departureTime: "11:00",
    arrivalDate: "2024-06-21",
    arrivalTime: "14:30",
    duration: "14h 30m",
    price: 1299,
    currency: "USD",
    availableSeats: 15,
    class: "business",
    stops: 1,
    stopoverCities: ["Seattle"],
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.8,
    image: DeltaImg,
  },
  {
    id: "4",
    flightNumber: "UA234",
    airline: "United Airlines",
    from: "Newark",
    fromCode: "EWR",
    to: "Rome",
    toCode: "FCO",
    departureDate: "2024-07-01",
    departureTime: "17:00",
    arrivalDate: "2024-07-02",
    arrivalTime: "08:00",
    duration: "8h 00m",
    price: 729,
    currency: "USD",
    availableSeats: 56,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.4,
    image: UnitedImg,
  },
  {
    id: "5",
    flightNumber: "EK201",
    airline: "Emirates",
    from: "New York",
    fromCode: "JFK",
    to: "Dubai",
    toCode: "DXB",
    departureDate: "2024-07-10",
    departureTime: "23:00",
    arrivalDate: "2024-07-11",
    arrivalTime: "19:30",
    duration: "12h 30m",
    price: 1499,
    currency: "USD",
    availableSeats: 8,
    class: "first",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 72h before",
    rating: 4.9,
    image: EmiratesImg,
  },
  {
    id: "6",
    flightNumber: "LH401",
    airline: "Lufthansa",
    from: "New York",
    fromCode: "JFK",
    to: "Frankfurt",
    toCode: "FRA",
    departureDate: "2024-07-15",
    departureTime: "16:30",
    arrivalDate: "2024-07-16",
    arrivalTime: "06:15",
    duration: "7h 45m",
    price: 679,
    currency: "USD",
    availableSeats: 52,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.5,
    image: LufthansaImg,
  },
  {
    id: "7",
    flightNumber: "TK002",
    airline: "Turkish Airlines",
    from: "New York",
    fromCode: "JFK",
    to: "Istanbul",
    toCode: "IST",
    departureDate: "2024-07-20",
    departureTime: "20:00",
    arrivalDate: "2024-07-21",
    arrivalTime: "12:30",
    duration: "9h 30m",
    price: 749,
    currency: "USD",
    availableSeats: 45,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.6,
    image: TurkishImg,
  },
  {
    id: "8",
    flightNumber: "QR702",
    airline: "Qatar Airways",
    from: "New York",
    fromCode: "JFK",
    to: "Doha",
    toCode: "DOH",
    departureDate: "2024-07-25",
    departureTime: "21:00",
    arrivalDate: "2024-07-26",
    arrivalTime: "17:15",
    duration: "11h 15m",
    price: 1399,
    currency: "USD",
    availableSeats: 12,
    class: "business",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.9,
    image: QatarImg,
  },
  {
    id: "9",
    flightNumber: "AC801",
    airline: "Air Canada",
    from: "New York",
    fromCode: "LGA",
    to: "Toronto",
    toCode: "YYZ",
    departureDate: "2024-08-01",
    departureTime: "08:00",
    arrivalDate: "2024-08-01",
    arrivalTime: "10:30",
    duration: "1h 30m",
    price: 299,
    currency: "USD",
    availableSeats: 62,
    class: "economy",
    stops: 0,
    baggage: "1 bag (23kg)",
    cancellationPolicy: "Free cancellation up to 2h before",
    rating: 4.3,
    image: AirCanadaImg,
  },
  {
    id: "10",
    flightNumber: "VS004",
    airline: "Virgin Atlantic",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departureDate: "2024-08-05",
    departureTime: "19:00",
    arrivalDate: "2024-08-06",
    arrivalTime: "07:30",
    duration: "7h 30m",
    price: 699,
    currency: "USD",
    availableSeats: 34,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.7,
    image: VirginImg,
  },
  {
    id: "11",
    flightNumber: "KL642",
    airline: "KLM Royal Dutch Airlines",
    from: "New York",
    fromCode: "JFK",
    to: "Amsterdam",
    toCode: "AMS",
    departureDate: "2024-08-10",
    departureTime: "17:30",
    arrivalDate: "2024-08-11",
    arrivalTime: "07:00",
    duration: "7h 30m",
    price: 659,
    currency: "USD",
    availableSeats: 44,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.5,
    image: KLMImg,
  },
  {
    id: "12",
    flightNumber: "NZ001",
    airline: "Air New Zealand",
    from: "New York",
    fromCode: "JFK",
    to: "Auckland",
    toCode: "AKL",
    departureDate: "2024-08-15",
    departureTime: "21:00",
    arrivalDate: "2024-08-17",
    arrivalTime: "06:00",
    duration: "17h 00m",
    price: 1899,
    currency: "USD",
    availableSeats: 9,
    class: "business",
    stops: 1,
    stopoverCities: ["Los Angeles"],
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 72h before",
    rating: 4.9,
    image: AirNewZealandImg,
  },
  {
    id: "13",
    flightNumber: "CX841",
    airline: "Cathay Pacific",
    from: "New York",
    fromCode: "JFK",
    to: "Hong Kong",
    toCode: "HKG",
    departureDate: "2024-08-20",
    departureTime: "10:00",
    arrivalDate: "2024-08-21",
    arrivalTime: "14:00",
    duration: "15h 00m",
    price: 1499,
    currency: "USD",
    availableSeats: 16,
    class: "business",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.8,
    image: CathayImg,
  },
  {
    id: "14",
    flightNumber: "SQ021",
    airline: "Singapore Airlines",
    from: "New York",
    fromCode: "JFK",
    to: "Singapore",
    toCode: "SIN",
    departureDate: "2024-08-25",
    departureTime: "23:00",
    arrivalDate: "2024-08-27",
    arrivalTime: "06:00",
    duration: "18h 00m",
    price: 1999,
    currency: "USD",
    availableSeats: 6,
    class: "first",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 72h before",
    rating: 5.0,
    image: SingaporeImg,
  },
  {
    id: "15",
    flightNumber: "LX017",
    airline: "Swiss International",
    from: "New York",
    fromCode: "JFK",
    to: "Zurich",
    toCode: "ZRH",
    departureDate: "2024-09-01",
    departureTime: "17:45",
    arrivalDate: "2024-09-02",
    arrivalTime: "07:30",
    duration: "7h 45m",
    price: 689,
    currency: "USD",
    availableSeats: 38,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.6,
    image: SwissImg,
  },
  {
    id: "16",
    flightNumber: "IB625",
    airline: "Iberia",
    from: "New York",
    fromCode: "JFK",
    to: "Madrid",
    toCode: "MAD",
    departureDate: "2024-09-05",
    departureTime: "15:30",
    arrivalDate: "2024-09-06",
    arrivalTime: "05:15",
    duration: "7h 45m",
    price: 619,
    currency: "USD",
    availableSeats: 47,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.4,
    image: IberiaImg,
  },
  {
    id: "17",
    flightNumber: "AZ609",
    airline: "Alitalia",
    from: "New York",
    fromCode: "JFK",
    to: "Milan",
    toCode: "MXP",
    departureDate: "2024-09-10",
    departureTime: "18:00",
    arrivalDate: "2024-09-11",
    arrivalTime: "08:00",
    duration: "8h 00m",
    price: 639,
    currency: "USD",
    availableSeats: 41,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.3,
    image: AlitaliaImg,
  },
  {
    id: "18",
    flightNumber: "NH109",
    airline: "ANA (All Nippon Airways)",
    from: "New York",
    fromCode: "JFK",
    to: "Tokyo",
    toCode: "HND",
    departureDate: "2024-09-15",
    departureTime: "13:00",
    arrivalDate: "2024-09-16",
    arrivalTime: "16:30",
    duration: "14h 30m",
    price: 1349,
    currency: "USD",
    availableSeats: 22,
    class: "business",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.9,
    image: ANAImg,
  },
  {
    id: "19",
    flightNumber: "KE082",
    airline: "Korean Air",
    from: "New York",
    fromCode: "JFK",
    to: "Seoul",
    toCode: "ICN",
    departureDate: "2024-09-20",
    departureTime: "12:30",
    arrivalDate: "2024-09-21",
    arrivalTime: "16:00",
    duration: "14h 30m",
    price: 1199,
    currency: "USD",
    availableSeats: 28,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.7,
    image: KoreanImg,
  },
  {
    id: "20",
    flightNumber: "EY100",
    airline: "Etihad Airways",
    from: "New York",
    fromCode: "JFK",
    to: "Abu Dhabi",
    toCode: "AUH",
    departureDate: "2024-09-25",
    departureTime: "22:00",
    arrivalDate: "2024-09-26",
    arrivalTime: "18:30",
    duration: "12h 30m",
    price: 1299,
    currency: "USD",
    availableSeats: 19,
    class: "business",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.8,
    image: EtihadImg,
  },
  {
    id: "21",
    flightNumber: "BA789",
    airline: "British Airways",
    from: "London",
    fromCode: "LHR",
    to: "New York",
    toCode: "JFK",
    departureDate: "2024-07-05",
    departureTime: "09:00",
    arrivalDate: "2024-07-05",
    arrivalTime: "12:00",
    duration: "8h 00m",
    price: 589,
    currency: "USD",
    availableSeats: 45,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.5,
    image: BritishAirwaysImg,
  },
  {
    id: "22",
    flightNumber: "LH789",
    airline: "Lufthansa",
    from: "Frankfurt",
    fromCode: "FRA",
    to: "New York",
    toCode: "JFK",
    departureDate: "2024-07-12",
    departureTime: "10:00",
    arrivalDate: "2024-07-12",
    arrivalTime: "12:30",
    duration: "8h 30m",
    price: 629,
    currency: "USD",
    availableSeats: 38,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.4,
    image: LufthansaImg,
  },
  {
    id: "23",
    flightNumber: "AF456",
    airline: "Air France",
    from: "Paris",
    fromCode: "CDG",
    to: "New York",
    toCode: "JFK",
    departureDate: "2024-07-18",
    departureTime: "11:00",
    arrivalDate: "2024-07-18",
    arrivalTime: "13:30",
    duration: "8h 30m",
    price: 579,
    currency: "USD",
    availableSeats: 52,
    class: "economy",
    stops: 0,
    baggage: "2 bags (23kg each)",
    cancellationPolicy: "Free cancellation up to 24h before",
    rating: 4.6,
    image: AirFranceImg,
  },
  {
    id: "24",
    flightNumber: "EK202",
    airline: "Emirates",
    from: "Dubai",
    fromCode: "DXB",
    to: "New York",
    toCode: "JFK",
    departureDate: "2024-07-25",
    departureTime: "02:30",
    arrivalDate: "2024-07-25",
    arrivalTime: "08:00",
    duration: "13h 30m",
    price: 1399,
    currency: "USD",
    availableSeats: 14,
    class: "business",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.8,
    image: EmiratesImg,
  },
  {
    id: "25",
    flightNumber: "SQ022",
    airline: "Singapore Airlines",
    from: "Singapore",
    fromCode: "SIN",
    to: "New York",
    toCode: "JFK",
    departureDate: "2024-08-30",
    departureTime: "23:30",
    arrivalDate: "2024-08-31",
    arrivalTime: "06:00",
    duration: "18h 30m",
    price: 1899,
    currency: "USD",
    availableSeats: 10,
    class: "first",
    stops: 0,
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 72h before",
    rating: 5.0,
    image: SingaporeImg,
  },
  {
    id: "26",
    flightNumber: "NZ002",
    airline: "Air New Zealand",
    from: "Auckland",
    fromCode: "AKL",
    to: "New York",
    toCode: "JFK",
    departureDate: "2024-08-22",
    departureTime: "08:00",
    arrivalDate: "2024-08-22",
    arrivalTime: "15:30",
    duration: "15h 30m",
    price: 1799,
    currency: "USD",
    availableSeats: 12,
    class: "business",
    stops: 1,
    stopoverCities: ["Los Angeles"],
    baggage: "3 bags (32kg each)",
    cancellationPolicy: "Free cancellation up to 48h before",
    rating: 4.9,
    image: AirNewZealandImg,
  },
];

function Flights() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">(
    "price",
  );
  const [selectedClass, setSelectedClass] = useState<
    "all" | "economy" | "business" | "first"
  >("all");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<Flight[]>("/flights", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "tenant-id": localStorage.getItem("tenantId") || "",
        },
      });

      if (response.data && response.data.length > 0) {
        setFlights(response.data);
      } else {
        setFlights(getDemoFlights());
      }
    } catch (err: any) {
      console.error("Error fetching flights:", err);

      if (err.response?.status === 401) {
        setError("Please login to view flights");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view flights");
      } else if (err.code === "ERR_NETWORK") {
      } else {
        setError(err.response?.data?.message || "Failed to load flights");
      }

      setFlights(getDemoFlights());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFlights();
    } else {
      setFlights(getDemoFlights());
      setLoading(false);
    }
  }, [token]);

  const fromCities = [
    ...new Map(
      flights.map((f) => [f.from, { name: f.from, code: f.fromCode }]),
    ).values(),
  ];
  const toCities = [
    ...new Map(
      flights.map((f) => [f.to, { name: f.to, code: f.toCode }]),
    ).values(),
  ];

  const availableDates = [
    ...new Set(flights.map((f) => f.departureDate)),
  ].sort();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDurationInMinutes = (duration: string): number => {
    const parts = duration.split("h");
    const hours = parseInt(parts[0]);
    const minutes = parts[1] ? parseInt(parts[1].replace("m", "")) : 0;
    return hours * 60 + minutes;
  };

  // const getAirlineColor = (airline: string) => {
  //   const colors: Record<string, string> = {
  //     "Air France": "#002157",
  //     "British Airways": "#2E5A9C",
  //     "Delta Airlines": "#003A70",
  //     "United Airlines": "#0066B3",
  //     Emirates: "#C60C30",
  //     Lufthansa: "#0A2B6E",
  //     "Turkish Airlines": "#B81B1B",
  //     "Qatar Airways": "#6C1D45",
  //     "Air Canada": "#FF0000",
  //     "Virgin Atlantic": "#C6002B",
  //     "KLM Royal Dutch Airlines": "#0055A4",
  //     "Air New Zealand": "#0A1E3F",
  //     "Cathay Pacific": "#A80000",
  //     "Singapore Airlines": "#011D3D",
  //     "Swiss International": "#FF0000",
  //     Iberia: "#FFD700",
  //     Alitalia: "#0066B3",
  //     "ANA (All Nippon Airways)": "#0055A4",
  //     "Korean Air": "#0066B3",
  //     "Etihad Airways": "#003A70",
  //   };
  //   return colors[airline] || "#4facfe";
  // };

  const getClassColor = (flightClass: string) => {
    switch (flightClass) {
      case "economy":
        return { bg: "#d4edda", color: "#155724", text: "Economy" };
      case "business":
        return { bg: "#cce5ff", color: "#004085", text: "Business" };
      case "first":
        return { bg: "#fff3cd", color: "#856404", text: "First Class" };
      default:
        return { bg: "#e2e3e5", color: "#383d41", text: "Economy" };
    }
  };

  const getStopsText = (stops: number, cities?: string[]) => {
    if (stops === 0) return "Direct";
    if (stops === 1) return `1 stop • ${cities?.[0] || "Layover"}`;
    return `${stops} stops`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredFlights = flights.filter((flight) => {
    if (
      fromLocation &&
      !flight.from.toLowerCase().includes(fromLocation.toLowerCase())
    )
      return false;
    if (
      toLocation &&
      !flight.to.toLowerCase().includes(toLocation.toLowerCase())
    )
      return false;
    if (departureDate && flight.departureDate !== departureDate) return false;
    if (selectedClass !== "all" && flight.class !== selectedClass) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        flight.flightNumber.toLowerCase().includes(search) ||
        flight.airline.toLowerCase().includes(search) ||
        flight.from.toLowerCase().includes(search) ||
        flight.to.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "duration") {
      const aDuration = getDurationInMinutes(a.duration);
      const bDuration = getDurationInMinutes(b.duration);
      return aDuration - bDuration;
    }
    if (sortBy === "departure")
      return a.departureTime.localeCompare(b.departureTime);
    return 0;
  });

  const handleViewDetails = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const handleBookFlight = (flight: Flight) => {
    alert(
      `✈️ Booking flight ${flight.flightNumber} from ${flight.from} to ${flight.to}\n\nDate: ${flight.departureDate}\nPrice: $${flight.price}\nNumber of passengers: ${passengers}\nTotal: $${(flight.price * passengers).toLocaleString()}\n\nProceeding to payment...`,
    );
    navigate("/payments");
  };

  const handleFromSelect = (city: string) => {
    setFromLocation(city);
    setShowFromDropdown(false);
  };

  const handleToSelect = (city: string) => {
    setToLocation(city);
    setShowToDropdown(false);
  };

  const clearFromFilter = () => {
    setFromLocation("");
    setShowFromDropdown(false);
  };

  const clearToFilter = () => {
    setToLocation("");
    setShowToDropdown(false);
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
          <h2 style={{ color: "#666" }}>Searching for flights...</h2>
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
              ⚠️ You are viewing demo data. Please login to see real flight
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
                onClick={fetchFlights}
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
          <h1
            style={{
              fontSize: "42px",
              color: "#2c3e50",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            ✈️🌍 Find Your Perfect Flight
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Compare prices from top airlines and book your next adventure
          </p>
        </div>

        {/* Search Filters */}
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
            }}
          >
            {/* From Dropdown */}
            <div ref={fromRef} style={{ position: "relative" }}>
              <input
                type='text'
                placeholder='✈️ From (city or airport)'
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                onFocus={() => setShowFromDropdown(true)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {fromLocation && (
                <button
                  onClick={clearFromFilter}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "0 10px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "12px",
                    height: "30px",
                  }}
                >
                  ✕
                </button>
              )}
              {showFromDropdown && fromCities.length > 0 && (
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
                  {fromCities.map((city) => (
                    <div
                      key={city.name}
                      onClick={() => handleFromSelect(city.name)}
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
                      <div style={{ fontWeight: "bold" }}>{city.name}</div>
                      <div style={{ fontSize: "11px", color: "#999" }}>
                        📍 Code: {city.code}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* To Dropdown */}
            <div ref={toRef} style={{ position: "relative" }}>
              <input
                type='text'
                placeholder='📍 To (city or airport)'
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                onFocus={() => setShowToDropdown(true)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {toLocation && (
                <button
                  onClick={clearToFilter}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "0 10px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "12px",
                    height: "30px",
                  }}
                >
                  ✕
                </button>
              )}
              {showToDropdown && toCities.length > 0 && (
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
                  {toCities.map((city) => (
                    <div
                      key={city.name}
                      onClick={() => handleToSelect(city.name)}
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
                      <div style={{ fontWeight: "bold" }}>{city.name}</div>
                      <div style={{ fontSize: "11px", color: "#999" }}>
                        📍 Code: {city.code}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <input
                type='date'
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              />
            </div>

            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "15px",
                fontSize: "14px",
                outline: "none",
                background: "white",
                cursor: "pointer",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  👥 {num} {num === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </select>
          </div>

          {/* Available Routes Info */}
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#e8f4fd",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#4facfe",
              textAlign: "center",
            }}
          >
            ✈️ Available routes:{" "}
            {fromCities
              .slice(0, 5)
              .map((c) => c.name)
              .join(", ")}
            {fromCities.length > 5 ? " +" : ""} →{" "}
            {toCities
              .slice(0, 5)
              .map((c) => c.name)
              .join(", ")}
            {toCities.length > 5 ? " +" : ""}
          </div>

          {/* Available Dates Info */}
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "#f0f8e8",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#27ae60",
              textAlign: "center",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>📅 Available dates:</span>
            {availableDates.slice(0, 8).map((date) => (
              <span
                key={date}
                onClick={() => setDepartureDate(date)}
                style={{
                  background: departureDate === date ? "#27ae60" : "white",
                  color: departureDate === date ? "white" : "#27ae60",
                  padding: "2px 8px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "11px",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (departureDate !== date) {
                    e.currentTarget.style.background = "#27ae60";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (departureDate !== date) {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#27ae60";
                  }
                }}
              >
                {formatDate(date)}
              </span>
            ))}
            {availableDates.length > 8 && (
              <span style={{ color: "#27ae60", fontSize: "11px" }}>
                +{availableDates.length - 8} more
              </span>
            )}
            {departureDate && (
              <span
                onClick={() => setDepartureDate("")}
                style={{
                  background: "#e74c3c",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                Clear
              </span>
            )}
          </div>

          {/* Second row - Sort and Class */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{ color: "#666", fontSize: "13px", fontWeight: 500 }}
              >
                ✈️ Class:
              </span>
              {(["all", "economy", "business", "first"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  style={{
                    padding: "6px 18px",
                    background: selectedClass === c ? "#4facfe" : "#f0f0f0",
                    color: selectedClass === c ? "white" : "#666",
                    border: "none",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: selectedClass === c ? "600" : "400",
                    transition: "all 0.3s",
                  }}
                >
                  {c === "all"
                    ? "All Classes"
                    : c === "economy"
                      ? "Economy"
                      : c === "business"
                        ? "Business"
                        : "First Class"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span
                style={{ color: "#666", fontSize: "13px", fontWeight: 500 }}
              >
                📊 Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "price" | "duration" | "departure",
                  )
                }
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "25px",
                  fontSize: "13px",
                  background: "white",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value='price'>💰 Price (Low to High)</option>
                <option value='duration'>⏱️ Duration (Shortest)</option>
                <option value='departure'>🕐 Departure Time (Earliest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "30px", width: "100%" }}>
          <input
            type='text'
            placeholder='🔍 Search by flight number, airline, or destination...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: "none",
              borderRadius: "30px",
              fontSize: "15px",
              outline: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              background: "white",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Results Count */}
        <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
          ✈️ Found {sortedFlights.length} flights
        </p>

        {/* Flights List - pa padding tek foto */}
        {sortedFlights.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🕊️</div>
            <h2 style={{ color: "#2c3e50", marginBottom: "10px" }}>
              No flights found
            </h2>
            <p style={{ color: "#666" }}>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {sortedFlights.map((flight) => {
              const classStyle = getClassColor(flight.class);
              return (
                <div
                  key={flight.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "25px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "20px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Airline Image - pa padding, pa margin */}
                  {flight.image && (
                    <img
                      src={flight.image}
                      alt={flight.airline}
                      style={{
                        width: "250px",
                        height: "200px",
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {/* Airline Info */}
                  <div style={{ minWidth: "140px" }}>
                    <h3
                      style={{
                        margin: "0 0 5px 0",
                        color: "#2c3e50",
                        fontSize: "16px",
                      }}
                    >
                      {flight.airline}
                    </h3>
                    <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>
                      {flight.flightNumber}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "5px",
                        padding: "2px 8px",
                        background: classStyle.bg,
                        color: classStyle.color,
                        borderRadius: "12px",
                        fontSize: "10px",
                      }}
                    >
                      {classStyle.text}
                    </span>
                  </div>

                  {/* Route Info */}
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: "20px",
                            color: "#2c3e50",
                          }}
                        >
                          {flight.fromCode}
                        </h2>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "#999",
                          }}
                        >
                          {flight.departureTime}
                        </p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "20px" }}>✈️</span>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            color: "#999",
                          }}
                        >
                          {flight.duration}
                        </p>
                      </div>
                      <div>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: "20px",
                            color: "#2c3e50",
                          }}
                        >
                          {flight.toCode}
                        </h2>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "#999",
                          }}
                        >
                          {flight.arrivalTime}
                        </p>
                      </div>
                    </div>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        fontSize: "11px",
                        color: "#27ae60",
                      }}
                    >
                      📅 {formatDate(flight.departureDate)}
                    </p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        fontSize: "11px",
                        color: "#4facfe",
                      }}
                    >
                      {getStopsText(flight.stops, flight.stopoverCities)}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div style={{ textAlign: "right", minWidth: "150px" }}>
                    <p
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: "#4facfe",
                        margin: 0,
                      }}
                    >
                      ${flight.price}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        margin: "0 0 10px 0",
                      }}
                    >
                      per passenger
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        style={{
                          padding: "6px 16px",
                          background: "#f0f0f0",
                          color: "#666",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                        onClick={() => handleViewDetails(flight)}
                      >
                        Details
                      </button>
                      <button
                        style={{
                          padding: "8px 20px",
                          background: "#4facfe",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleBookFlight(flight)}
                      >
                        Book Now
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

      {/* Modal for Flight Details */}
      {showModal && selectedFlight && (
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

            {/* Modal Image */}
            {selectedFlight.image && (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  overflow: "hidden",
                  borderRadius: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f5f5f5",
                }}
              >
                <img
                  src={selectedFlight.image}
                  alt={selectedFlight.airline}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>✈️</div>
              <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "22px" }}>
                {selectedFlight.airline} - {selectedFlight.flightNumber}
              </h2>
              <p style={{ color: "#666", fontSize: "14px" }}>
                {selectedFlight.from} ({selectedFlight.fromCode}) →{" "}
                {selectedFlight.to} ({selectedFlight.toCode})
              </p>
              <p
                style={{ color: "#27ae60", fontSize: "13px", marginTop: "5px" }}
              >
                📅 {formatDate(selectedFlight.departureDate)}
              </p>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <h3
                style={{
                  margin: "0 0 15px 0",
                  color: "#2c3e50",
                  fontSize: "16px",
                }}
              >
                Flight Details
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Departure:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedFlight.departureDate} at{" "}
                  {selectedFlight.departureTime}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Arrival:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedFlight.arrivalDate} at {selectedFlight.arrivalTime}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Duration:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedFlight.duration}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Class:</span>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedFlight.class}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Available Seats:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedFlight.availableSeats}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Baggage:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedFlight.baggage}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Cancellation:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {selectedFlight.cancellationPolicy}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>Rating:</span>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#f39c12",
                  }}
                >
                  ★ {selectedFlight.rating}/5
                </span>
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
                Price Summary
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Base price:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  ${selectedFlight.price}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Passengers:
                </span>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {passengers}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingTop: "10px",
                  borderTop: "1px dashed #eee",
                }}
              >
                <span
                  style={{
                    color: "#2c3e50",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Total:
                </span>
                <span
                  style={{
                    color: "#4facfe",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  ${(selectedFlight.price * passengers).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleBookFlight(selectedFlight);
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

export default Flights;
