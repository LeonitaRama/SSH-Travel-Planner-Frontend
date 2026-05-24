import { useEffect, useState } from "react";
import api from "../services/api";

function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.get("/reviews").then((res) => {
      setReviews(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Reviews</h1>

      {reviews.map((review) => (
        <div key={review.id}>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
