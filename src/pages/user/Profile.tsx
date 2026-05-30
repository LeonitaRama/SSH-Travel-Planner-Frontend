// pages/user/Profile.tsx (versioni pa username)
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setError("");
      const response = await api.get("/users/profile/me");
      setProfile(response.data);
      setNewEmail(response.data.email);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // Dërgo vetëm email-in
      await api.patch(`/users/${user?.id}`, { email: newEmail });
      setEditing(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className='p-6 text-center'>Loading profile...</div>;

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
        <div className='p-6 border-b dark:border-gray-700'>
          <h1 className='text-2xl font-bold dark:text-white'>👤 My Profile</h1>
        </div>

        {error && (
          <div className='mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-lg'>
            {error}
          </div>
        )}

        <div className='p-6 space-y-6'>
          {/* Dark Mode Toggle */}
          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <div>
              <p className='font-semibold dark:text-white'>🌙 Dark Mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className='relative inline-flex h-6 w-11 items-center rounded-full transition-colors'
              style={{
                backgroundColor: theme === "dark" ? "#3B82F6" : "#9CA3AF",
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Username (readonly) */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Username
            </label>
            <p className='text-gray-900 dark:text-white'>
              {profile?.username || "Not set"}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Username cannot be changed
            </p>
          </div>

          {/* Role Badge */}
          <div className='flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Account Role
              </p>
              <p className='font-semibold dark:text-white'>{profile?.role}</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Tenant</p>
              <p className='font-semibold dark:text-white'>{tenant?.name}</p>
            </div>
          </div>

          {/* Email (editable) */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Email
            </label>
            {editing ? (
              <input
                type='email'
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            ) : (
              <p className='text-gray-900 dark:text-white'>{profile?.email}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Member Since
            </label>
            <p className='text-gray-900 dark:text-white'>
              {new Date(profile?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className='p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between'>
          {editing ? (
            <div className='space-x-3'>
              <button
                onClick={() => setEditing(false)}
                className='px-4 py-2 border rounded-md hover:bg-gray-100'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={logout}
            className='px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
