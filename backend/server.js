require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("✅ Conectado ao banco de dados MySQL!");
  connection.release();
});

app.post("/api/register", async (req, res) => {
  const { nome, telefone, senha, email, cpf } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);

  const sql =
    "INSERT INTO usuario (nome, telefone, senha, email, cpf) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [nome, telefone, hashedPassword, email, cpf], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Email, CPF ou Telefone já cadastrado.",
        });
      }
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao registrar usuário." });
    }

    res
      .status(201)
      .json({ success: true, message: "Usuário registrado com sucesso!" });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuario WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou senha inválidos." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.senha);

    if (isMatch) {
      res.status(200).json({
        success: true,
        message: "Login bem-sucedido!",
        user: {
          id: user.id_usuario,
          nome: user.nome,
          email: user.email,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Email ou senha inválidos." });
    }
  });
});

/*Rota cartão*/
/*Buscar cartão*/
app.get("/api/cards/:userId", (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT id_cartao, numero_cartao, bandeira, nome_titular, data_vencimento FROM cartao WHERE id_usuario = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar cartões:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro no servidor." });
    }

    res.status(200).json({ success: true, cards: results });
  });
});
app.post("/api/cards", (req, res) => {
  const { numero_cartao, bandeira, nome_titular, data_vencimento, id_usuario } =
    req.body;
  const sql =
    "INSERT INTO cartao (numero_cartao, bandeira, nome_titular, data_vencimento, id_usuario) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [numero_cartao, bandeira, nome_titular, data_vencimento, id_usuario],
    (err, result) => {
      if (err) {
        console.error("Erro ao salvar cartão:", err);
        return res
          .status(500)
          .json({ success: false, message: "Erro ao salvar cartão." });
      }
      res.status(201).json({
        success: true,
        message: "Cartão adicionado!",
        cardId: result.insertId,
      });
    }
  );
});

/* Atualizar cartão */
app.put("/api/cards/:cardId", (req, res) => {
  const { cardId } = req.params;
  const { nome_titular, data_vencimento } = req.body;

  const sql =
    "UPDATE cartao SET nome_titular = ?, data_vencimento = ? WHERE id_cartao = ?";

  db.query(sql, [nome_titular, data_vencimento, cardId], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar cartão:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao atualizar cartão." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cartão não encontrado." });
    }
    res
      .status(200)
      .json({ success: true, message: "Cartão atualizado com sucesso!" });
  });
});

/* Deleter cartão */
app.delete("/api/cards/:cardId", (req, res) => {
  const { cardId } = req.params;

  const sql = "DELETE FROM cartao WHERE id_cartao = ?";

  db.query(sql, [cardId], (err, result) => {
    if (err) {
      console.error("Erro ao deletar cartão:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao deletar cartão." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cartão não encontrado." });
    }
    res
      .status(200)
      .json({ success: true, message: "Cartão removido com sucesso!" });
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});
