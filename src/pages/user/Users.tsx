// pages/user/Users.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";
import api from "../../services/api";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const { tenant } = useTenant();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError("");
      // Hiq "/v1/" nga URL
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Email and password are required");
      return;
    }

    try {
      await api.post("/users", newUser);
      setShowCreateModal(false);
      setNewUser({ email: "", password: "", role: "CUSTOMER" });
      fetchUsers();
      alert("User created successfully!");
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
      alert("User deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "STAFF":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  if (loading) return <div className='p-6 text-center'>Loading users...</div>;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>👥 Users Management</h1>
        {(currentUser?.role === "ADMIN" ||
          currentUser?.role === "SUPER_ADMIN") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            + Add User
          </button>
        )}
      </div>

      {error && (
        <div className='bg-red-100 text-red-700 p-3 rounded-md mb-4'>
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <p className='text-gray-500'>No users found.</p>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Created
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className='px-6 py-4'>
                    <Link
                      to={`/${tenant?.slug}/users/${user.id}`}
                      className='text-blue-600 hover:underline'
                    >
                      {user.username || user.email.split("@")[0]}
                    </Link>
                  </td>
                  <td className='px-6 py-4'>{user.email}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 space-x-2'>
                    <Link
                      to={`/${tenant?.slug}/users/${user.id}`}
                      className='text-blue-600 hover:text-blue-800'
                    >
                      Edit
                    </Link>
                    {currentUser?.role === "SUPER_ADMIN" &&
                      user.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className='text-red-600 hover:text-red-800 ml-3'
                        >
                          Delete
                        </button>
                      )}
                    {currentUser?.role === "ADMIN" &&
                      user.id !== currentUser.id &&
                      user.role !== "ADMIN" &&
                      user.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className='text-red-600 hover:text-red-800 ml-3'
                        >
                          Delete
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <h2 className='text-xl font-bold mb-4'>Create New User</h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email *
                </label>
                <input
                  type='email'
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className='w-full px-3 py-2 border rounded-md'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Password *
                </label>
                <input
                  type='password'
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className='w-full px-3 py-2 border rounded-md'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className='w-full px-3 py-2 border rounded-md'
                >
                  <option value='CUSTOMER'>Customer</option>
                  <option value='STAFF'>Staff</option>
                  {currentUser?.role === "SUPER_ADMIN" && (
                    <option value='ADMIN'>Admin</option>
                  )}
                </select>
              </div>
            </div>

            <div className='flex justify-end space-x-3 mt-6'>
              <button
                onClick={() => setShowCreateModal(false)}
                className='px-4 py-2 border rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
