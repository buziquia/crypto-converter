// routes/favorites.js
const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Adicionar ou remover favorito
router.post("/", authenticateToken, (req, res) => {
  const { coin } = req.body;
  const userId = req.user.id;

  if (!coin) return res.status(400).json({ error: "Moeda é obrigatória" });

  // Verifica se já existe
  db.query(
    "SELECT * FROM favorites WHERE user_id = ? AND coin = ?",
    [userId, coin],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        // Remove dos favoritos
        db.query(
          "DELETE FROM favorites WHERE user_id = ? AND coin = ?",
          [userId, coin],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: "Favorito removido" });
          }
        );
      } else {
        // Adiciona aos favoritos
        db.query(
          "INSERT INTO favorites (user_id, coin) VALUES (?, ?)",
          [userId, coin],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.status(201).json({ message: "Favorito adicionado" });
          }
        );
      }
    }
  );
});

// Listar favoritos do usuário
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT coin FROM favorites WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      const coins = results.map((r) => r.coin);
      res.json(coins);
    }
  );
});

module.exports = router;
