import { useEffect, useState } from "react";
import api from "../services/api";

function Flights() {
  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    api.get("/flights").then((res) => {
      setFlights(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Flights</h1>

      {flights.map((flight) => (
        <div key={flight.id}>
          <p>{flight.flightNumber}</p>
        </div>
      ))}
    </div>
  );
}

export default Flights;
