import { useEffect, useState } from "react";
import api from "../services/api";

interface Hotel {
  id: string;
  name: string;
  address: string;
}

function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    api.get("/hotels").then((res) => {
      setHotels(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Hotels</h1>

      {hotels.map((hotel) => (
        <div key={hotel.id}>
          <h3>{hotel.name}</h3>
          <p>{hotel.address}</p>
        </div>
      ))}
    </div>
  );
}

export default Hotels;
