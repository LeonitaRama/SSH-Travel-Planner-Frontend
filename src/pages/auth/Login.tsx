// pages/auth/Login.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";

export default function Login() {
  const { login, user } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const { tenantSlug } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Përcakto rrugën e dashboard-it
  const getDashboardPath = useCallback(() => {
    if (!user || !tenantSlug) return null;
    return user.role === "ADMIN" || user.role === "SUPER_ADMIN"
      ? `/${tenantSlug}/admin/stats`
      : `/${tenantSlug}`;
  }, [user, tenantSlug]);

  // Nëse user është tashmë i loguar, redirect (vetëm nëse nuk është tashmë aty)
  useEffect(() => {
    const dashboardPath = getDashboardPath();
    if (dashboardPath && window.location.pathname !== dashboardPath) {
      navigate(dashboardPath, { replace: true });
    }
  }, [user, tenantSlug, navigate, getDashboardPath]);

  if (tenantLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Navigimi bëhet nga useEffect
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to {tenant?.name || "your account"}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Don't have an account?{" "}
            <Link
              to={`/${tenantSlug}/register`}
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Create one now
            </Link>
          </p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'>
            {error}
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Password'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
