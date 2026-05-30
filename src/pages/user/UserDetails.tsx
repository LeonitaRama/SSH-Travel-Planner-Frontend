// pages/user/UserDetails.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";
import api from "../../services/api";

interface UserDetail {
  id: string;
  email: string;
  username: string;
  role: string;
  tenantId: string;
  createdAt: string;
}

export default function UserDetails() {
  const { id } = useParams();
  const { tenant } = useTenant();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState("");

  const canEdit =
    currentUser?.role === "SUPER_ADMIN" ||
    (currentUser?.role === "ADMIN" && currentUser?.id !== id);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setError("");
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
      setFormData({
        username: response.data.username || "",
        email: response.data.email,
        role: response.data.role,
      });
    } catch (error: any) {
      console.error("Error fetching user:", error);
      setError(error.response?.data?.message || "Failed to load user");
      if (error.response?.status === 404) {
        navigate(`/${tenant?.slug}/users`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/users/${id}`, formData);
      setEditing(false);
      fetchUser();
      alert("User updated successfully!");
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      alert("User deleted successfully!");
      navigate(`/${tenant?.slug}/users`);
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

  if (loading)
    return <div className='p-6 text-center'>Loading user details...</div>;
  if (error) return <div className='p-6 text-center text-red-600'>{error}</div>;
  if (!user) return <div className='p-6 text-center'>User not found</div>;

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
        <div className='p-6 border-b dark:border-gray-700'>
          <h1 className='text-2xl font-bold dark:text-white'>
            👤 User Details
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            View and manage user information
          </p>
        </div>

        <div className='p-6 space-y-6'>
          <div className='flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                User ID
              </p>
              <p className='font-mono text-sm dark:text-white'>{user.id}</p>
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(user.role)}`}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Email
            </label>
            {editing && canEdit ? (
              <input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            ) : (
              <p className='text-gray-900 dark:text-white'>{user.email}</p>
            )}
          </div>

          {editing && canEdit && (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              >
                <option value='CUSTOMER'>Customer</option>
                <option value='STAFF'>Staff</option>
                {currentUser?.role === "SUPER_ADMIN" && (
                  <option value='ADMIN'>Admin</option>
                )}
              </select>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Member Since
            </label>
            <p className='text-gray-900 dark:text-white'>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className='p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between'>
          <div className='space-x-3'>
            {canEdit && (
              <>
                {editing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className='px-4 py-2 border rounded-md hover:bg-gray-100'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600'
                  >
                    Edit User
                  </button>
                )}
              </>
            )}
            {(currentUser?.role === "SUPER_ADMIN" ||
              (currentUser?.role === "ADMIN" &&
                user.role !== "SUPER_ADMIN" &&
                user.id !== currentUser?.id)) && (
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Delete User
              </button>
            )}
          </div>
          <Link
            to={`/${tenant?.slug}/users`}
            className='px-4 py-2 border rounded-md hover:bg-gray-100'
          >
            Back to Users
          </Link>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useTenant } from "../../hooks/useTenant";
// import api from "../../services/api";

// interface UserDetail {
//   id: string;
//   email: string;
//   username: string;
//   role: string;
//   tenantId: string;
//   createdAt: string;
// }

// export default function UserDetails() {
//   const { id } = useParams();
//   const { tenant } = useTenant();
//   const { user: currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [user, setUser] = useState<UserDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     role: "",
//   });
//   const [error, setError] = useState("");

//   const canEdit =
//     currentUser?.role === "SUPER_ADMIN" ||
//     (currentUser?.role === "ADMIN" && currentUser?.id !== id);

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   const fetchUser = async () => {
//     try {
//       setError("");
//       const response = await api.get(`/users/${id}`);
//       setUser(response.data);
//       setFormData({
//         username: response.data.username || "",
//         email: response.data.email,
//         role: response.data.role,
//       });
//     } catch (error: any) {
//       console.error("Error fetching user:", error);
//       setError(error.response?.data?.message || "Failed to load user");
//       if (error.response?.status === 404) {
//         navigate(`/${tenant?.slug}/users`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await api.patch(`/users/${id}`, formData);
//       setEditing(false);
//       fetchUser();
//       alert("User updated successfully!");
//     } catch (error: any) {
//       console.error("Error updating user:", error);
//       alert(error.response?.data?.message || "Failed to update user");
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await api.delete(`/users/${id}`);
//       alert("User deleted successfully!");
//       navigate(`/${tenant?.slug}/users`);
//     } catch (error: any) {
//       console.error("Error deleting user:", error);
//       alert(error.response?.data?.message || "Failed to delete user");
//     }
//   };

//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case "SUPER_ADMIN":
//         return "bg-purple-100 text-purple-800";
//       case "ADMIN":
//         return "bg-red-100 text-red-800";
//       case "STAFF":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-green-100 text-green-800";
//     }
//   };

//   if (loading)
//     return <div className='p-6 text-center'>Loading user details...</div>;
//   if (error) return <div className='p-6 text-center text-red-600'>{error}</div>;
//   if (!user) return <div className='p-6 text-center'>User not found</div>;

//   return (
//     <div className='max-w-2xl mx-auto'>
//       <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
//         <div className='p-6 border-b dark:border-gray-700'>
//           <h1 className='text-2xl font-bold dark:text-white'>
//             👤 User Details
//           </h1>
//           <p className='text-gray-600 dark:text-gray-400 mt-1'>
//             View and manage user information
//           </p>
//         </div>

//         <div className='p-6 space-y-6'>
//           <div className='flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
//             <div>
//               <p className='text-sm text-gray-500 dark:text-gray-400'>
//                 User ID
//               </p>
//               <p className='font-mono text-sm dark:text-white'>{user.id}</p>
//             </div>
//             <div>
//               <span
//                 className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(user.role)}`}
//               >
//                 {user.role}
//               </span>
//             </div>
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
//               Email
//             </label>
//             {editing && canEdit ? (
//               <input
//                 type='email'
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
//               />
//             ) : (
//               <p className='text-gray-900 dark:text-white'>{user.email}</p>
//             )}
//           </div>

//           {editing && canEdit && (
//             <div>
//               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
//                 Role
//               </label>
//               <select
//                 value={formData.role}
//                 onChange={(e) =>
//                   setFormData({ ...formData, role: e.target.value })
//                 }
//                 className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
//               >
//                 <option value='CUSTOMER'>Customer</option>
//                 <option value='STAFF'>Staff</option>
//                 {currentUser?.role === "SUPER_ADMIN" && (
//                   <option value='ADMIN'>Admin</option>
//                 )}
//               </select>
//             </div>
//           )}

//           <div>
//             <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
//               Member Since
//             </label>
//             <p className='text-gray-900 dark:text-white'>
//               {new Date(user.createdAt).toLocaleDateString()}
//             </p>
//           </div>
//         </div>

//         <div className='p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between'>
//           <div className='space-x-3'>
//             {canEdit && (
//               <>
//                 {editing ? (
//                   <>
//                     <button
//                       onClick={handleUpdate}
//                       className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
//                     >
//                       Save Changes
//                     </button>
//                     <button
//                       onClick={() => setEditing(false)}
//                       className='px-4 py-2 border rounded-md hover:bg-gray-100'
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => setEditing(true)}
//                     className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600'
//                   >
//                     Edit User
//                   </button>
//                 )}
//               </>
//             )}
//             {(currentUser?.role === "SUPER_ADMIN" ||
//               (currentUser?.role === "ADMIN" &&
//                 user.role !== "SUPER_ADMIN" &&
//                 user.id !== currentUser?.id)) && (
//               <button
//                 onClick={handleDelete}
//                 className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
//               >
//                 Delete User
//               </button>
//             )}
//           </div>
//           <Link
//             to={`/${tenant?.slug}/users`}
//             className='px-4 py-2 border rounded-md hover:bg-gray-100'
//           >
//             Back to Users
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
