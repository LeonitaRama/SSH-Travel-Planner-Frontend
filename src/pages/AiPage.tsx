// pages/AiPage.tsx
import { useState } from "react";
import api from "../services/api";

export default function AiPage() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(1000);
  const [interests, setInterests] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRecommendation = async () => {
    setLoading(true);
    try {
      const response = await api.post("/ai/recommendations", {
        destination,
        budget,
        interests,
      });
      setRecommendation(response.data.recommendation);
    } catch (error) {
      console.error("Error:", error);
      setRecommendation(
        "Failed to generate recommendations. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <h1 className='text-2xl font-bold mb-4 dark:text-white'>
          🤖 AI Travel Assistant
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Get personalized travel recommendations powered by AI
        </p>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Destination
            </label>
            <input
              type='text'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              placeholder='e.g., Paris, Tokyo, New York'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Budget (€)
            </label>
            <input
              type='number'
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Interests
            </label>
            <textarea
              rows={3}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              placeholder='e.g., luxury hotels, museums, beaches, adventure'
            />
          </div>

          <button
            onClick={generateRecommendation}
            disabled={loading || !destination}
            className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? "Generating..." : "Get Recommendations"}
          </button>

          {recommendation && (
            <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <h3 className='font-semibold mb-2 dark:text-white'>
                Recommendations
              </h3>
              <p className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                {recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
