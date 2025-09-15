import React from "react";
import Converter from "../components/Converter";
import Favorites from "../components/Favorites";
import History from "../components/History";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Sair
        </button>
      </header>

      <section style={{
        backgroundColor: "#f9f9f9",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <Converter />
      </section>

      <section style={{
        backgroundColor: "#f9f9f9",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <Favorites />
      </section>

      <section style={{
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <History />
      </section>
    </div>
  );
};

export default Dashboard;
