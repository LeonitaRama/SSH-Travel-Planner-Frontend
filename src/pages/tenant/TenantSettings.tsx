import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

export default function TenantSettings() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { theme: currentTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    theme: "light",
    language: "en",
    currency: "EUR",
  });

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const formatCurrency = (amount: number) => {
    const symbol =
      formData.currency === "USD"
        ? "$"
        : formData.currency === "GBP"
          ? "£"
          : formData.currency === "CHF"
            ? "Fr"
            : formData.currency === "ALL"
              ? "Lek"
              : "€";
    return `${symbol}${amount.toFixed(2)}`;
  };

  if (!isAdmin) {
    return (
      <div className='p-6 text-center'>
        <div className='bg-red-100 text-red-700 p-4 rounded-lg'>
          ⚠️ You don't have permission to access tenant settings.
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setError(null);
      const response = await api.get("/tenant-settings");
      if (response.data) {
        setFormData({
          theme: response.data.theme === "dark" ? "dark" : "light",
          language: response.data.language || "en",
          currency: response.data.currency || "EUR",
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.patch("/tenant-settings", formData);
      alert("✅ Tenant settings updated successfully!");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update settings");
      alert("❌ Failed to update tenant settings");
    } finally {
      setSaving(false);
    }
  };

  const previewAmount = 1234.56;

  if (loading)
    return <div className='p-6 text-center'>Loading tenant settings...</div>;

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div
        className={`rounded-lg shadow ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className='p-6 border-b dark:border-gray-700'>
          <h1 className='text-2xl font-bold dark:text-white'>
            🏢 Tenant Settings
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage your agency's default settings
          </p>
          <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
            🔒 These settings affect the entire agency.
          </p>
        </div>

        {error && (
          <div className='mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-lg'>
            {error}
          </div>
        )}

        <div className='p-6 space-y-6'>
          {/* Default Currency */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              💰 Default Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            >
              <option value='USD'>USD ($)</option>
              <option value='EUR'>EUR (€)</option>
              <option value='GBP'>GBP (£)</option>
              <option value='CHF'>CHF (Fr)</option>
              <option value='ALL'>ALL (Lek)</option>
            </select>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              Preview: {formatCurrency(previewAmount)}
            </p>
          </div>

          {/* Default Language */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              🌐 Default Language
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            >
              <option value='en'>English</option>
            </select>
          </div>

          {/* Default Theme */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              🎨 Default Theme
            </label>
            <select
              value={formData.theme}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  theme: e.target.value as "light" | "dark",
                })
              }
              className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            >
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
            </select>
          </div>

          {/* Preview Section */}
          <div
            className={`p-4 rounded-lg ${formData.theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <p className='text-sm font-medium mb-2 dark:text-white'>Preview:</p>
            <div className='flex gap-4 flex-wrap'>
              <span
                className={`px-3 py-1 rounded text-sm ${formData.theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
              >
                {formData.currency}
              </span>
              <span className='text-sm dark:text-gray-300'>
                {formatCurrency(99.99)}
              </span>
              <span
                className={`px-3 py-1 rounded text-sm ${formData.theme === "dark" ? "bg-green-600 text-white" : "bg-green-500 text-white"}`}
              >
                {formData.language.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Tenant Info */}
          <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              <strong>🏪 Agency:</strong> {tenant?.name}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
              <strong>🆔 Tenant ID:</strong> {tenant?.id?.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div className='p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg'>
          <button
            onClick={handleUpdateSettings}
            disabled={saving}
            className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition'
          >
            {saving ? "💾 Saving..." : "💾 Save Tenant Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
