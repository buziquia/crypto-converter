import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggle = () => setShowLogin(!showLogin);
  const handleSuccess = () => window.location.href = "/dashboard";

  return (
    <div>
      {showLogin ? <Login onLogin={handleSuccess} /> : <Register onRegister={handleSuccess} />}
      <button onClick={toggle}>{showLogin ? "Criar conta" : "Já tenho conta"}</button>
    </div>
  );
};

export default AuthPage;
