import { useEffect, useState } from "react";
import api from "../services/api";

function BookingItems() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get("/booking-items").then((res) => {
      setItems(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Booking Items</h1>

      {items.map((item) => (
        <div key={item.id}>
          <p>{item.type}</p>
        </div>
      ))}
    </div>
  );
}

export default BookingItems;
