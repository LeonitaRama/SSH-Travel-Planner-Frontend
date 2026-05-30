// pages/destination/DestinationForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDestination } from "../../context/DestinationContext";
import { useTenant } from "../../hooks/useTenant";

export default function DestinationForm() {
  const { tenant } = useTenant();
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchDestinationById, createDestination, updateDestination } =
    useDestination();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    imageUrl: "",
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const load = async () => {
        const data = await fetchDestinationById(id!);
        setFormData({
          name: data.name,
          country: data.country,
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });
      };
      load();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateDestination(id!, formData);
        alert("Destination updated!");
      } else {
        await createDestination(formData);
        alert("Destination created!");
      }
      navigate(`/${tenant?.slug}/destinations`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <h1 className='text-2xl font-bold mb-6'>
          {isEditing ? "Edit Destination" : "Create Destination"}
        </h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Name *'
            required
            className='w-full p-2 border rounded'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type='text'
            placeholder='Country *'
            required
            className='w-full p-2 border rounded'
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
          <textarea
            placeholder='Description'
            rows={4}
            className='w-full p-2 border rounded'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type='url'
            placeholder='Image URL'
            className='w-full p-2 border rounded'
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 bg-blue-600 text-white rounded'
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
            <button
              type='button'
              onClick={() => navigate(`/${tenant?.slug}/destinations`)}
              className='px-4 py-2 border rounded'
            >
              Cancel
            </button>

            
          </div>
        </form>
      </div>
    </div>
  );
}
