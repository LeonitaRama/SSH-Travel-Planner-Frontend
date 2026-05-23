import { useEffect, useState } from "react";
import api from "../services/api";

function TravelPackages() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    api.get("/travel-packages").then((res) => {
      setPackages(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Travel Packages</h1>

      {packages.map((pkg) => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default TravelPackages;
