import React, { useState, useEffect } from "react";
import api from "../api";
import axios from "axios";

const Converter = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: { vs_currency: "usd", order: "market_cap_desc", per_page: 100, page: 1 },
          }
        );
        setCoins(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoins();
  }, []);

  const handleConvert = async () => {
    if (!amount) return;

    const coinData = coins.find((c) => c.id === selectedCoin);
    if (!coinData) return;

    const valueUsd = coinData.current_price * parseFloat(amount);
    const valueBrl = valueUsd * 5.2; // valor de exemplo

    setResult({ usd: valueUsd.toFixed(2), brl: valueBrl.toFixed(2) });

    try {
      const res = await api.post("/conversions", {
        coin: selectedCoin,
        amount,
        value_usd: valueUsd,
        value_brl: valueBrl,
      });

      if (res.data.success) {
        console.log("Conversão salva com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar conversão:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{
      padding: "15px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "15px" }}>Simulador de Conversão</h2>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          style={{ padding: "5px", flex: 1 }}
        >
          {coins.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "5px", flex: 1 }}
        />

        <button
          onClick={handleConvert}
          style={{
            padding: "5px 10px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Converter
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "10px" }}>
          <p>USD: ${result.usd}</p>
          <p>BRL: R${result.brl}</p>
        </div>
      )}
    </div>
  );
};

export default Converter;
