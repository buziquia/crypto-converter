require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/auth");

const conversionRoutes = require("./routes/conversions");
const favoriteRoutes = require("./routes/favorites");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste na raiz
app.get("/", (req, res) => {
  res.send("🚀 API rodando!");
});

// Rotas de conversões e favoritos
app.use("/conversions", conversionRoutes);
app.use("/favorites", favoriteRoutes);

// Rotas públicas de autenticação
app.use("/auth", authRoutes);

// Exemplo de rota protegida
app.get("/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query("SELECT id, email FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(results[0]);
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
