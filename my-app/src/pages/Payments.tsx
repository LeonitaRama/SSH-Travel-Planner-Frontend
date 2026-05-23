import { useEffect, useState } from "react";
import api from "../services/api";

function Payments() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    api.get("/payments").then((res) => {
      setPayments(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Payments</h1>

      {payments.map((payment) => (
        <div key={payment.id}>
          <p>{payment.amount} €</p>
        </div>
      ))}
    </div>
  );
}

export default Payments;
