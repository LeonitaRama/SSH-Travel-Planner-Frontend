import { useEffect, useState } from "react";
import api from "../services/api";

function Rooms() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    api.get("/rooms").then((res) => {
      setRooms(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Rooms</h1>

      {rooms.map((room) => (
        <div key={room.id}>
          <p>{room.roomNumber}</p>
        </div>
      ))}
    </div>
  );
}

export default Rooms;
