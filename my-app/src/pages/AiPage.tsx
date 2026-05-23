import { useState } from "react";
import api from "../services/api";

function AiPage() {
  const [result, setResult] = useState("");

  const generateRecommendation = async () => {
    const response = await api.post("/ai/recommendations", {
      destination: "Paris",
      budget: 1000,
      interests: "luxury hotels",
    });

    setResult(response.data.recommendation);
  };

  return (
    <div>
      <h1>AI Recommendations</h1>

      <button onClick={generateRecommendation}>Generate</button>

      <p>{result}</p>
    </div>
  );
}

export default AiPage;
