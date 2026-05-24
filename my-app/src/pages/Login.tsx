import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data);
      alert("Login successful!");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
