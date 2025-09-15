import React, { useState, useEffect } from "react";
import api from "../api";

const History = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/conversions");

      const formatted = res.data.map(h => ({
        ...h,
        amount: Number(h.amount),
        value_usd: Number(h.value_usd),
        value_brl: Number(h.value_brl)
      }));

      setHistory(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await api.delete("/conversions");
      setHistory([]); // limpa frontend imediatamente
      alert("Histórico limpo com sucesso!");
    } catch (err) {
      console.error("Erro ao limpar histórico:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Histórico de Conversões</h2>
      {history.length > 0 && (
        <button
          onClick={handleClearHistory}
          style={{
            marginBottom: "10px",
            padding: "5px 10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Limpar Histórico
        </button>
      )}

      {history.length === 0 ? (
        <p>Nenhuma conversão feita ainda.</p>
      ) : (
        <ul>
          {history.map(h => (
            <li key={h.id}>
              {h.amount} {h.coin} → USD: ${h.value_usd.toFixed(2)}, BRL: R${h.value_brl.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
