// pages/destination/DestinationDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDestination } from "../../context/DestinationContext";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";

// Interfekset lokale (ose importo nga një file i përbashkët)
interface Hotel {
  id: string;
  name: string;
  rating: number | null;
  pricePerNight: number;
}

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  price: number;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const { user } = useAuth();
  const {
    fetchDestinationById,
    deleteDestination,
    fetchHotelsByDestination,
    fetchFlightsByDestination,
  } = useDestination();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const canEdit =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "STAFF";

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [dest, hotelsData, flightsData] = await Promise.all([
          fetchDestinationById(id),
          fetchHotelsByDestination(id),
          fetchFlightsByDestination(id),
        ]);
        setDestination(dest);
        setHotels(hotelsData);
        setFlights(flightsData);
      } catch (error) {
        console.error(error);
        navigate(`/${tenant?.slug}/destinations`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [
    id,
    fetchDestinationById,
    fetchHotelsByDestination,
    fetchFlightsByDestination,
    navigate,
    tenant?.slug,
  ]);

  const handleDelete = async () => {
    if (confirm("Delete this destination and all related data?")) {
      await deleteDestination(id!);
      navigate(`/${tenant?.slug}/destinations`);
    }
  };

  if (loading) return <div className='p-6 text-center'>Loading...</div>;
  if (!destination)
    return <div className='p-6 text-center'>Destination not found</div>;

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='relative h-96 rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-blue-500 to-purple-600'>
        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-end p-6'>
          <div>
            <h1 className='text-4xl font-bold text-white'>
              {destination.name}
            </h1>
            <p className='text-xl text-white'>{destination.country}</p>
          </div>
        </div>
        {canEdit && (
          <div className='absolute top-4 right-4 flex gap-2'>
            <Link
              to={`/${tenant?.slug}/destinations/${destination.id}/edit`}
              className='px-4 py-2 bg-yellow-500 text-white rounded'
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className='px-4 py-2 bg-red-600 text-white rounded'
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Description</h2>
        <p>{destination.description || "No description available."}</p>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-4'>🏨 Hotels</h2>
        {hotels.length === 0 && <p>No hotels found.</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              to={`/${tenant?.slug}/hotels/${hotel.id}`}
              className='block border p-3 rounded hover:shadow'
            >
              <h3 className='font-semibold'>{hotel.name}</h3>
              <p className='text-sm text-gray-500'>
                ⭐ {hotel.rating || "N/A"} • €{hotel.pricePerNight}/night
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <h2 className='text-xl font-semibold mb-4'>✈️ Flights</h2>
        {flights.length === 0 && <p>No flights found.</p>}
        <div className='space-y-3'>
          {flights.map((flight) => (
            <Link
              key={flight.id}
              to={`/${tenant?.slug}/flights/${flight.id}`}
              className='block border p-3 rounded hover:shadow'
            >
              <div className='flex justify-between'>
                <span>
                  {flight.airline} - {flight.flightNumber}
                </span>
                <span className='font-bold'>€{flight.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
