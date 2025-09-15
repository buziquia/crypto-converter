import React, { useState, useEffect } from "react";
import api from "../api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [coinInput, setCoinInput] = useState("");

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites");
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async () => {
    if (!coinInput) return;
    try {
      await api.post("/favorites", { coin: coinInput });
      setCoinInput("");
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Favoritos</h2>
      <input placeholder="Nome da moeda" value={coinInput} onChange={e => setCoinInput(e.target.value)} />
      <button onClick={toggleFavorite}>Adicionar / Remover</button>
      {favorites.length === 0 ? <p>Nenhuma moeda favoritada.</p> : (
        <ul>
          {favorites.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
