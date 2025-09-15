// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const router = express.Router();
const SALT_ROUNDS = 10;

// Registro (signup)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios" });

    // Verifica se já existe
    db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(409).json({ error: "Usuário já existe" });

      // Criptografa a senha
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      // Insere no BD
      db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash], (err2, result2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        const userId = result2.insertId;
        // Gera token
        const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
        res.status(201).json({ message: "Usuário criado", token });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios" });

  db.query("SELECT id, password FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Credenciais inválidas" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Credenciais inválidas" });

    // Gera token
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
    res.json({ message: "Logado com sucesso", token });
  });
});

module.exports = router;
