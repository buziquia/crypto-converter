import React, { useState } from "react";
import api from "../api";

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      onRegister();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao registrar");
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Cadastrar</button>
    </div>
  );
};

export default Register;
