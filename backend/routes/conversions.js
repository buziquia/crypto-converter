const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/auth");

// Salvar conversão
router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { coin, amount, value_usd, value_brl } = req.body;

  if (!coin || !amount || !value_usd || !value_brl) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  db.query(
    "INSERT INTO conversions (user_id, coin, amount, value_usd, value_brl) VALUES (?, ?, ?, ?, ?)",
    [userId, coin, amount, value_usd, value_brl],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: results.insertId });
    }
  );
});

// Listar histórico
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM conversions WHERE user_id = ? ORDER BY id DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

router.delete("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query("DELETE FROM conversions WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: results.affectedRows });
  });
});

module.exports = router;
