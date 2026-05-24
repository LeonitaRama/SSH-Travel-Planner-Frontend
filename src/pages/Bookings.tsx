import { useEffect, useState } from "react";
import api from "../services/api";

function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    api.get("/bookings").then((res) => {
      setBookings(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Bookings</h1>

      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>{booking.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Bookings;
