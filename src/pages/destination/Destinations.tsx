// pages/destination/Destinations.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDestination } from "../../context/DestinationContext";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";

export default function Destinations() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { destinations, loading, fetchDestinations, deleteDestination } =
    useDestination();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const canEdit =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "STAFF";

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDestination(id);
    }
  };

  if (loading)
    return <div className='p-6 text-center'>Loading destinations...</div>;

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Destinations</h1>
        {canEdit && (
          <Link
            to={`/${tenant?.slug}/destinations/new`}
            className='px-4 py-2 bg-blue-600 text-white rounded-md'
          >
            + Add Destination
          </Link>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {destinations.map((dest) => (
          <div key={dest.id} className='bg-white rounded-lg shadow p-4'>
            <h3 className='text-xl font-semibold'>{dest.name}</h3>
            <p className='text-gray-600'>{dest.country}</p>
            <p className='text-gray-700 text-sm mt-2 line-clamp-2'>
              {dest.description}
            </p>
            <div className='mt-4 flex justify-between'>
              <Link
                to={`/${tenant?.slug}/destinations/${dest.id}`}
                className='text-blue-600'
              >
                View →
              </Link>
              {canEdit && (
                <div className='space-x-2'>
                  <Link
                    to={`/${tenant?.slug}/destinations/${dest.id}/edit`}
                    className='text-green-600'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className='text-red-600'
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
