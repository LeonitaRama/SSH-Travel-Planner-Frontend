// // Menaxhon destinacionet,
// // hotelet,
// // dhomat,
// // fluturimet,
// // aeroportet dhe
// // linjat ajrore.

// import {
//   createContext,
//   useContext,
//   useState,
//   useMemo,
//   useCallback,
//   ReactNode,
// } from "react";
// import api from "../services/api";

// // =========================================================================
// // 1. Tipizimet (Interfaces) bazuar në skemën tuaj të Prisma-s
// // =========================================================================
// export interface Destination {
//   id: string;
//   tenantId: string;
//   name: string;
//   country: string;
//   description: string | null;
//   imageUrl: string | null;
//   createdAt: string;
// }

// export interface Hotel {
//   id: string;
//   tenantId: string;
//   name: string;
//   description: string;
//   address: string;
//   rating: number | null;
//   pricePerNight: number;
//   imageUrl: string | null;
//   destinationId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Room {
//   id: string;
//   name: string;
//   description: string | null;
//   price: number;
//   capacity: number;
//   imageUrl: string | null;
//   tenantId: string;
//   hotelId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Flight {
//   id: string;
//   tenantId: string;
//   flightNumber: string;
//   airline: string;
//   departureCity: string;
//   arrivalCity: string;
//   price: number;
//   departureTime: string | null;
//   arrivalTime: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Airport {
//   id: string;
//   tenantId: string;
//   name: string;
//   code: string;
//   city: string;
//   country: string;
//   createdAt: string;
// }

// export interface Airline {
//   id: string;
//   tenantId: string;
//   name: string;
//   code: string;
//   country: string;
//   createdAt: string;
// }

// // =========================================================================
// // 2. Defino se çfarë do të ofrojë ky Context për Frontend-in
// // =========================================================================
// interface TravelContextType {
//   // Shtetet (States) për të dhënat
//   destinations: Destination[];
//   hotels: Hotel[];
//   rooms: Room[];
//   flights: Flight[];
//   airports: Airport[];
//   airlines: Airline[];

//   // Shtetet e ngarkimit dhe gabimeve
//   loading: boolean;
//   error: string | null;

//   // Funksionet për Udhëtimet (Fetches & Mutations)
//   // DESTINATIONS
//   fetchDestinations: () => Promise<void>;
//   fetchDestinationById: (id: string) => Promise<Destination>;
//   createDestination: (data: Partial<Destination>) => Promise<void>;
//   updateDestination: (id: string, data: Partial<Destination>) => Promise<void>;
//   deleteDestination: (id: string) => Promise<void>;
//   fetchHotelsByDestination: (id: string) => Promise<Hotel[]>;
//   fetchFlightsByDestination: (id: string) => Promise<Flight[]>;

//   // HOTELS
//   fetchHotels: () => Promise<void>;
//   fetchHotelById: (id: string) => Promise<Hotel>;
//   createHotel: (data: Partial<Hotel>) => Promise<void>;
//   updateHotel: (id: string, data: Partial<Hotel>) => Promise<void>;
//   deleteHotel: (id: string) => Promise<void>;

//   // ROOMS
//   fetchRooms: () => Promise<void>;
//   fetchRoomById: (id: string) => Promise<Room>;
//   createRoom: (data: Partial<Room>) => Promise<void>;
//   updateRoom: (id: string, data: Partial<Room>) => Promise<void>;
//   deleteRoom: (id: string) => Promise<void>;

//   // FLIGHTS
//   fetchFlights: () => Promise<void>;
//   fetchFlightById: (id: string) => Promise<Flight>;
//   createFlight: (data: Partial<Flight>) => Promise<void>;
//   updateFlight: (id: string, data: Partial<Flight>) => Promise<void>;
//   deleteFlight: (id: string) => Promise<void>;

//   // AIRPORTS
//   fetchAirports: () => Promise<void>;
//   fetchAirportById: (id: string) => Promise<Airport>;
//   createAirport: (data: Partial<Airport>) => Promise<void>;
//   updateAirport: (id: string, data: Partial<Airport>) => Promise<void>;
//   deleteAirport: (id: string) => Promise<void>;
//   fetchAirportDepartures: (id: string) => Promise<Flight[]>;
//   fetchAirportArrivals: (id: string) => Promise<Flight[]>;

//   // AIRLINES
//   fetchAirlines: () => Promise<void>;
//   fetchAirlineById: (id: string) => Promise<Airline>;
//   createAirline: (data: Partial<Airline>) => Promise<void>;
//   updateAirline: (id: string, data: Partial<Airline>) => Promise<void>;
//   deleteAirline: (id: string) => Promise<void>;
// }

// export const TravelContext = createContext<TravelContextType | null>(null);

// export function TravelProvider({ children }: { children: ReactNode }) {
//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [flights, setFlights] = useState<Flight[]>([]);
//   const [airports, setAirports] = useState<Airport[]>([]);
//   const [airlines, setAirlines] = useState<Airline[]>([]);

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Helper funksion për të menaxhuar gabimet në mënyrë të konsistente
//   const handleError = useCallback((err: any, defaultMessage: string) => {
//     const msg = err.response?.data?.message || defaultMessage;
//     setError(msg);
//     setLoading(false);
//     throw new Error(msg);
//   }, []);

//   // =========================================================================
//   // DESTINACIONET (GET, POST)
//   // =========================================================================
//   // context/TravelContext.tsx - Shto këtë log në fetchDestinations
//   const fetchDestinations = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Destination[]>("/destinations");
//       console.log("API Response for destinations:", res.data);
//       console.log("First destination ID type:", typeof res.data[0]?.id);
//       console.log("First destination ID value:", res.data[0]?.id);
//       setDestinations(res.data);
//     } catch (err) {
//       handleError(err, "Ngarkimi i destinacioneve dështoi.");
//     } finally {
//       setLoading(false);
//     }
//   }, [handleError]);

//   const fetchDestinationById = useCallback(async (id: string) => {
//     const res = await api.get<Destination>(`/destinations/${id}`);
//     return res.data;
//   }, []);

//   const createDestination = useCallback(
//     async (data: Partial<Destination>) => {
//       setLoading(true);
//       try {
//         const res = await api.post<Destination>("/destinations", data);
//         setDestinations((prev) => [res.data, ...prev]);
//       } catch (err) {
//         handleError(err, "Krijimi i destinacionit dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const updateDestination = useCallback(
//     async (id: string, data: Partial<Destination>) => {
//       setLoading(true);
//       try {
//         const res = await api.patch<Destination>(`/destinations/${id}`, data);
//         setDestinations((prev) =>
//           prev.map((item) => (item.id === id ? res.data : item)),
//         );
//       } catch (err) {
//         handleError(err, "Përditësimi dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const deleteDestination = useCallback(
//     async (id: string) => {
//       setLoading(true);
//       try {
//         await api.delete(`/destinations/${id}`);
//         setDestinations((prev) => prev.filter((item) => item.id !== id));
//       } catch (err) {
//         handleError(err, "Fshirja dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const fetchHotelsByDestination = useCallback(async (id: string) => {
//     const res = await api.get<Hotel[]>(`/destinations/${id}/hotels`);
//     return res.data;
//   }, []);

//   const fetchFlightsByDestination = useCallback(async (id: string) => {
//     const res = await api.get<Flight[]>(`/destinations/${id}/flights`);
//     return res.data;
//   }, []);

//   // =========================================================================
//   // HOTELET (GET, GET BY DESTINATION, POST)
//   // =========================================================================
//   // context/TravelContext.tsx
//   const fetchHotels = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Hotel[]>("/hotels");
//       // Këtu API kthen hotel-et me destination të përfshirë nëse backend e ka konfiguruar
//       setHotels(res.data);
//     } catch (err) {
//       handleError(err, "Ngarkimi i hoteleve dështoi.");
//     } finally {
//       setLoading(false);
//     }
//   }, [handleError]);

//   const fetchHotelById = useCallback(async (id: string) => {
//     const res = await api.get<Hotel>(`/hotels/${id}`);
//     return res.data;
//   }, []);

//   const createHotel = useCallback(
//     async (data: Partial<Hotel>) => {
//       setLoading(true);
//       try {
//         const res = await api.post<Hotel>("/hotels", data);
//         setHotels((prev) => [res.data, ...prev]);
//       } catch (err) {
//         handleError(err, "Krijimi i hotelit dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const updateHotel = useCallback(
//     async (id: string, data: Partial<Hotel>) => {
//       setLoading(true);
//       try {
//         const res = await api.patch<Hotel>(`/hotels/${id}`, data);
//         setHotels((prev) =>
//           prev.map((item) => (item.id === id ? res.data : item)),
//         );
//       } catch (err) {
//         handleError(err, "Përditësimi dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const deleteHotel = useCallback(
//     async (id: string) => {
//       setLoading(true);
//       try {
//         await api.delete(`/hotels/${id}`);
//         setHotels((prev) => prev.filter((item) => item.id !== id));
//       } catch (err) {
//         handleError(err, "Fshirja dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   // =========================================================================
//   // DHOMAT (GET BY HOTEL, POST)
//   // =========================================================================
//   const fetchRooms = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Room[]>("/rooms");
//       setRooms(res.data);
//     } catch (err) {
//       handleError(err, "Ngarkimi i dhomave dështoi.");
//     } finally {
//       setLoading(false);
//     }
//   }, [handleError]);

//   const fetchRoomById = useCallback(async (id: string) => {
//     const res = await api.get<Room>(`/rooms/${id}`);
//     return res.data;
//   }, []);

//   const createRoom = useCallback(
//     async (data: Partial<Room>) => {
//       setLoading(true);
//       try {
//         const res = await api.post<Room>("/rooms", data);
//         setRooms((prev) => [res.data, ...prev]);
//       } catch (err) {
//         handleError(err, "Krijimi i dhomës dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const updateRoom = useCallback(
//     async (id: string, data: Partial<Room>) => {
//       setLoading(true);
//       try {
//         const res = await api.patch<Room>(`/rooms/${id}`, data);
//         setRooms((prev) =>
//           prev.map((item) => (item.id === id ? res.data : item)),
//         );
//       } catch (err) {
//         handleError(err, "Përditësimi dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const deleteRoom = useCallback(
//     async (id: string) => {
//       setLoading(true);
//       try {
//         await api.delete(`/rooms/${id}`);
//         setRooms((prev) => prev.filter((item) => item.id !== id));
//       } catch (err) {
//         handleError(err, "Fshirja dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   // =========================================================================
//   // FLUTURIMET (GET, POST)
//   // =========================================================================
//   const fetchFlights = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Flight[]>("/flights");
//       setFlights(res.data);
//     } catch (err) {
//       handleError(err, "Ngarkimi i fluturimeve dështoi.");
//     } finally {
//       setLoading(false);
//     }
//   }, [handleError]);

//   const fetchFlightById = useCallback(async (id: string) => {
//     const res = await api.get(`/flights/${id}`);
//     return res.data;
//   }, []);

//   const createFlight = useCallback(
//     async (data: Partial<Flight>) => {
//       setLoading(true);
//       try {
//         const res = await api.post("/flights", data);
//         setFlights((prev) => [res.data, ...prev]);
//       } catch (err) {
//         handleError(err, "Krijimi i fluturimit dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const updateFlight = useCallback(
//     async (id: string, data: Partial<Flight>) => {
//       setLoading(true);
//       try {
//         const res = await api.patch(`/flights/${id}`, data);
//         setFlights((prev) =>
//           prev.map((item) => (item.id === id ? res.data : item)),
//         );
//       } catch (err) {
//         handleError(err, "Përditësimi dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const deleteFlight = useCallback(
//     async (id: string) => {
//       setLoading(true);
//       try {
//         await api.delete(`/flights/${id}`);
//         setFlights((prev) => prev.filter((item) => item.id !== id));
//       } catch (err) {
//         handleError(err, "Fshirja dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   // =========================================================================
//   // AEROPORTET (GET, POST)
//   // =========================================================================
//   const fetchAirports = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Airport[]>("/airports");
//       setAirports(res.data);
//     } catch (err) {
//       handleError(err, "Ngarkimi i aeroporteve dështoi.");
//     } finally {
//       setLoading(false);
//     }
//   }, [handleError]);

//   const fetchAirportById = useCallback(async (id: string) => {
//     const res = await api.get(`/airports/${id}`);
//     return res.data;
//   }, []);

//   const createAirport = useCallback(
//     async (data: Partial<Airport>) => {
//       setLoading(true);
//       try {
//         const res = await api.post("/airports", data);
//         setAirports((prev) => [res.data, ...prev]);
//       } catch (err) {
//         handleError(err, "Krijimi i aeroportit dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const updateAirport = useCallback(
//     async (id: string, data: Partial<Airport>) => {
//       setLoading(true);
//       try {
//         const res = await api.patch(`/airports/${id}`, data);
//         setAirports((prev) =>
//           prev.map((item) => (item.id === id ? res.data : item)),
//         );
//       } catch (err) {
//         handleError(err, "Përditësimi dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const deleteAirport = useCallback(
//     async (id: string) => {
//       setLoading(true);
//       try {
//         await api.delete(`/airports/${id}`);
//         setAirports((prev) => prev.filter((item) => item.id !== id));
//       } catch (err) {
//         handleError(err, "Fshirja dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );

//   const fetchAirportDepartures = useCallback(async (id: string) => {
//     const res = await api.get<Flight[]>(`/airports/${id}/flights/departures`);
//     return res.data;
//   }, []);
//   const fetchAirportArrivals = useCallback(async (id: string) => {
//     const res = await api.get<Flight[]>(`/airports/${id}/flights/arrivals`);
//     return res.data;
//   }, []);

//   // =========================================================================
//   // LINJAT AJRORE (GET, POST)
//   // =========================================================================
//   const fetchAirlines = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Airline[]>("/airlines");
//       setAirlines(res.data);
//     } catch (err) {
//       handleError(err, "Ngarkimi i linjave ajrore dështoi.");
//     } finally {
//       setLoading(false);
//     }
//   }, [handleError]);
//   const fetchAirlineById = useCallback(async (id: string) => {
//     const res = await api.get(`/airlines/${id}`);
//     return res.data;
//   }, []);

//   const createAirline = useCallback(
//     async (data: Partial<Airline>) => {
//       setLoading(true);
//       try {
//         const res = await api.post("/airlines", data);
//         setAirlines((prev) => [res.data, ...prev]);
//       } catch (err) {
//         handleError(err, "Krijimi i linjës ajrore dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );
//   const updateAirline = useCallback(
//     async (id: string, data: Partial<Airline>) => {
//       setLoading(true);
//       try {
//         const res = await api.patch(`/airlines/${id}`, data);
//         setAirlines((prev) =>
//           prev.map((item) => (item.id === id ? res.data : item)),
//         );
//       } catch (err) {
//         handleError(err, "Përditësimi dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );
//   const deleteAirline = useCallback(
//     async (id: string) => {
//       setLoading(true);
//       try {
//         await api.delete(`/airlines/${id}`);
//         setAirlines((prev) => prev.filter((item) => item.id !== id));
//       } catch (err) {
//         handleError(err, "Fshirja dështoi.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleError],
//   );
//   // =========================================================================
//   // 3. Otimizimi i Vlerave (useMemo)
//   // =========================================================================
//   const value = useMemo(
//     () => ({
//       destinations,
//       hotels,
//       rooms,
//       flights,
//       airports,
//       airlines,
//       loading,
//       error,
//       fetchDestinations,
//       fetchDestinationById,
//       createDestination,
//       updateDestination,
//       deleteDestination,
//       fetchHotelsByDestination,
//       fetchFlightsByDestination,
//       fetchHotels,
//       fetchHotelById,
//       createHotel,
//       updateHotel,
//       deleteHotel,
//       fetchRooms,
//       fetchRoomById,
//       createRoom,
//       updateRoom,
//       deleteRoom,
//       fetchFlights,
//       fetchFlightById,
//       createFlight,
//       updateFlight,
//       deleteFlight,
//       fetchAirports,
//       fetchAirportById,
//       createAirport,
//       updateAirport,
//       deleteAirport,
//       fetchAirportDepartures,
//       fetchAirportArrivals,
//       fetchAirlines,
//       fetchAirlineById,
//       createAirline,
//       updateAirline,
//       deleteAirline,
//     }),
//     [
//       destinations,
//       hotels,
//       rooms,
//       flights,
//       airports,
//       airlines,
//       loading,
//       error,
//       fetchDestinations,
//       fetchDestinationById,
//       createDestination,
//       updateDestination,
//       deleteDestination,
//       fetchHotelsByDestination,
//       fetchFlightsByDestination,
//       fetchHotels,
//       fetchHotelById,
//       createHotel,
//       updateHotel,
//       deleteHotel,
//       fetchRooms,
//       fetchRoomById,
//       createRoom,
//       updateRoom,
//       deleteRoom,
//       fetchFlights,
//       fetchFlightById,
//       createFlight,
//       updateFlight,
//       deleteFlight,
//       fetchAirports,
//       fetchAirportById,
//       createAirport,
//       updateAirport,
//       deleteAirport,
//       fetchAirportDepartures,
//       fetchAirportArrivals,
//       fetchAirlines,
//       fetchAirlineById,
//       createAirline,
//       updateAirline,
//       deleteAirline,
//     ],
//   );
//   return (
//     <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
//   );
// }
// export function useTravel() {
//   const context = useContext(TravelContext);
//   if (!context) throw new Error("useTravel must be used inside TravelProvider");
//   return context;
// }
